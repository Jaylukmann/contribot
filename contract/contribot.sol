// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IBentoxBox {
    function balanceOf(
        address,
         address
        ) external view returns (uint256);

    function deposit(
        IERC20 token_,
        address from,
        address to,
        uint256 amount,
        uint256 share
    ) external payable returns (uint256 amountOut, uint256 shareOut);

    function withdraw(
        IERC20 token_,
        address from,
        address to,
        uint256 amount,
        uint256 share
    ) external returns (uint256 amountOut, uint256 shareOut);

    function totalSupply(
        IERC20 token
        ) external view returns (uint256);
}

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

    contract Contribot{ 
    using SafeERC20 for IERC20;

    enum GroupState {
        Open,
        Closed,
        Terminate
    }

    struct Group {
        GroupState groupState;
        uint256 time_interval;
        uint256 timeCreated;
        uint256 timeStarted;
        uint256 contract_total_deposit_balance;
        uint256 contract_total_collateral_balance;
        uint256 deposit_amount; //The deployer of each group contract will set this for others
        uint256 max_member_num;
        uint256 required_collateral;
        uint256 num_of_members_who_recieved_funds;
        address address_of_token;
        address groupAddress;
    }

    
    mapping(address => bool) public isGroupMember;
    mapping(address => uint256) public memberToCollateral; //map a member to the collateral he deposited
    mapping(address => uint256) public memberToDeposit; // map each member address to their deposit
    mapping(address => bool) public has_member_recieved;
    mapping(address => mapping(address => bool)) public has_donated_for_member;
    mapping(address => mapping(address => bool)) public has_received_donation;
    mapping(address => uint256) public userClaimableDeposit;
    mapping(address => bool) public approve_To_Claim_Without_Complete_Votes;
    mapping(address => uint256) public total_votes_recieved;

    mapping(address => bool) public hasWithdrawnCollateralAndYield;
    mapping(address => uint256) public memberToPosition;
    mapping(uint256 => address) public positionToMember;

    address[] public members;
    uint256 public returns_due_to_members;
    uint256 public yields_due_to_members;


    //map a user to amount deposited- ofcourse all members will deposit same amount
    //map a user's membership of a purse to true
    //map user to all the group he is invloved in

    // maps a member address to check if he has recieved a round of contribution or not
    //maps a user to number of votes to have funds received- this will be required to be equal to no of members in a group

    //these next 2 should be changed to a regular state variable instead

    // maps a user address to true to approve the user to claim even without complete votes

    //address of acceptable erc20 token - basically a stable coin DAI-rinkeby

    IERC20 tokenInstance;
    Group public group; //instantiate struct purse



    address constant ADMIN = 0x2854CEfba4d6E7FD03D91807E774ae71Ef63e64E;

    //instantiate IBentoxBox on mumbai
    address constant BENTOBOX_ADDRESS =
        0xF5BCE5077908a1b7370B9ae04AdC565EBd643966;
    IBentoxBox bentoBoxInstance = IBentoxBox(BENTOBOX_ADDRESS);

    //events
    event GroupCreated(
        address groupAddress,
        address indexed creator,
        uint256 first_deposit,
        uint256 max_members,
        uint256 indexed time_created
    );
    event MemberVotedFor(
        address indexed member,
        uint256 indexed numberOfVotes
    );
    event DonationDeposited(
        address indexed member,
        uint256 amount,
        address indexed groupAddress,
        address receiver
    );

    event ClaimedFull(
        address indexed member,
        address indexed groupAddress,
        uint256 amount,
        uint256 dateClaimed
    );

    event ClaimedPart(
        address indexed member,
        address indexed groupAddress,
        uint256 amount,
        uint256 dateClaimed
    );

    event MemberLeft(address indexed member, uint256 time);

    modifier onlyGroupMember(address _address) {
        require(isGroupMember[_address] == true, "only group members please");
        _;
    }

    //deposit of collateral for creator happens in token factory- see createPurse function
    // interval is in days
    constructor(
        address creator,
        uint256 amount,
        uint256 max_member,
        uint256 time_interval,
        address tokenAddress,
        uint256 position
    ) {
        group.deposit_amount = amount; //set this amount to deposit_amount
        group.max_member_num = max_member; //set max needed member
        uint256 required_collateral = amount * (max_member - 1);
        group.required_collateral = required_collateral;

        require(position <= max_member, "Position out of range");
        //  require(tokenInstance.balanceOf(address(this)) == (amount + required_collateral), 'deposit of funds and collateral not happening, ensure you are deploying from GroupFactory Contract');
        memberToDeposit[creator] = amount; //
        memberToCollateral[creator] = required_collateral;
        memberToPosition[creator] = position;
        positionToMember[position] = creator;
        members.push(creator); //push member to array of members

        //convert time_interval to seconds
        group.time_interval = time_interval * 24 * 60 * 60;
        isGroupMember[creator] = true; //set msg.sender to be true as a member of the purse already
        group.groupState = GroupState.Open; //set purse state to Open
        group.contract_total_collateral_balance += required_collateral; //increment mapping for all collaterals
        group.timeCreated = block.timestamp;
        group.address_of_token = tokenAddress;
        group.groupAddress = address(this);
        tokenInstance = IERC20(tokenAddress);

        emit GroupCreated(
            address(this),
            creator,
            amount,
            max_member,
            block.timestamp
        );
    }

    /**  @notice upon joining a group, you need not include deposit amount
        deposit amount will be needed when donating for a specific user using the
        depositDonation() function
        */

    function joinGroup(uint256 _position) public {
        require(
            group.groupState == GroupState.Open,
            "This group is no longer accepting members"
        );
        require(
            isGroupMember[msg.sender] == false,
            "You are already a member in this purse"
        );
        require( _position != 0 && _position <= group.max_member_num, "Position out of range");

        address[] memory _members = members;
        for (uint8 i = 0; i < members.length; i++) {
            require(_position != memberToPosition[members[i]], "position taken");
        }

        tokenInstance.transferFrom(
            msg.sender,
            address(this),
            (group.required_collateral)
        );
        memberToCollateral[msg.sender] = group.required_collateral;
        members.push(msg.sender); //push member to array of members
        memberToPosition[msg.sender] = _position;
        positionToMember[_position] = msg.sender;
        isGroupMember[msg.sender] = true; //set msg.sender to be true as a member of the purse already
        group.contract_total_collateral_balance += group.required_collateral; //increment mapping for all collaterals

        //close group if max_member_num is reached
        if (members.length == group.max_member_num) {
            group.groupState = GroupState.Closed;
            group.timeStarted = block.timestamp;
            deposit_funds_to_bentoBox();
        }
    }

    /// @notice this function is available in the instance a group doesn't get full on time
    /// and a member wants to leave
    function leaveGroup() public onlyGroupMember(msg.sender) {
        require(group.groupState == GroupState.Open, "Group open already");
        isGroupMember[msg.sender] = false;
        memberToPosition[msg.sender] = 0;
        memberToCollateral[msg.sender] = 0;
        group.contract_total_collateral_balance -= group.required_collateral;

        // gets the index of the member trying to leave from the array of members
        // switches the position of the member to be removed as last item and vice versa
        // then pop it
        for (uint8 i = 0; i < members.length; i++) {
            if (members[i] == msg.sender) {
                members[i] = members[members.length - 1];
                members[members.length - 1] = msg.sender;
                members.pop();
            }
        }
        tokenInstance.transfer(msg.sender, (group.required_collateral));
        emit MemberLeft(msg.sender, block.timestamp);
    }

    function depositDonation(address _member)
        public
        onlyGroupMember(msg.sender)
    {
        (address _currentMemberToRecieve, , ) = currentRoundDetails();
        require(_member == _currentMemberToRecieve, "Not your round receive");
        require(
            has_donated_for_member[msg.sender][_member] == false,
            "You have donated for this member already"
        );
        require(
            has_member_recieved[_member] == false,
            "this user has recieved donation already"
        );

        userClaimableDeposit[_member] += group.deposit_amount;
        group.contract_total_deposit_balance += group.deposit_amount;

        has_donated_for_member[msg.sender][_member] = true;
        has_received_donation[msg.sender][_member] = true;
        tokenInstance.transferFrom(
            msg.sender,
            address(this),
            group.deposit_amount
        );
        emit DonationDeposited(
            msg.sender,
            group.deposit_amount,
            address(this),
            _member
        );
    }

    // member who have been voted for as next will be the one to claim
    function claimDonations(address _member) public onlyGroupMember(msg.sender) {
        require(
            has_received_donation[msg.sender][_member] == false,
            "You have recieved a round of contribution already"
        );
        require(
            userClaimableDeposit[msg.sender] > 0,
            "You currently have no deposit for you to claim"
        );

        if (
            userClaimableDeposit[msg.sender] <
            (group.deposit_amount * (group.max_member_num - 1))
        ) {
            require(
                approve_To_Claim_Without_Complete_Votes[msg.sender] == true,
                "Get approved to recieve incomplete donation"
            );
            group.num_of_members_who_recieved_funds += 1;
            has_received_donation[msg.sender][_member] = true;
            tokenInstance.transfer(
                msg.sender,
                userClaimableDeposit[msg.sender]
            );
            emit ClaimedPart(
                msg.sender,
                address(this),
                userClaimableDeposit[msg.sender],
                block.timestamp
            );
        } else {
            group.num_of_members_who_recieved_funds += 1;
            has_received_donation[msg.sender][_member] = true;
            tokenInstance.transfer(
                msg.sender,
                userClaimableDeposit[msg.sender]
            );
            emit ClaimedFull(
                msg.sender,
                address(this),
                userClaimableDeposit[msg.sender],
                block.timestamp
            );
        }
    }

    // this function is meant to give the contract a go-ahead to disburse funds to a member even though he doesnt have complete votes_for_member_to_recieve_funds
    // this for instance where a member(s) seem unresponsive in the group to vote for another person
    function approveToClaimWithoutCompleteVotes(address _member)
        public
        onlyGroupMember(msg.sender)
    {
        require(
            isGroupMember[_member] == true,
            "This provided address is not a member"
        );
        approve_To_Claim_Without_Complete_Votes[_member] = true;
    }

    function deposit_funds_to_bentoBox() internal onlyGroupMember(msg.sender) {
        require(
            members.length == group.max_member_num,
            "Incomplete membership yet"
        );
        uint256 MIN_FUND = group.contract_total_collateral_balance;
        tokenInstance.approve(BENTOBOX_ADDRESS, MIN_FUND);
        bentoBoxInstance.deposit(
            tokenInstance,
            address(this),
            address(this),
            group.contract_total_collateral_balance,
            0
        );

        group.contract_total_collateral_balance = 0;
    }

    function bentoBox_balance() public view returns (uint256) {
        uint256 bento_box_balance = bentoBoxInstance.balanceOf(
            group.address_of_token,
            address(this)
        );
        return bento_box_balance;
    }

    //any member can call this function
    function withdraw_funds_from_bentoBox() public onlyGroupMember(msg.sender) {
      
        require(block.timestamp >= (group.timeStarted + (group.time_interval * members.length)), 'Group rounds are not completed');
        
        uint256 bento_box_balance = bentoBoxInstance.balanceOf(
            group.address_of_token,
            address(this)
        );
        //bentoBox withdraw function returns 2 values, in this case, shares will be what is the group the total fund- Its collateral deposits plus yields
        uint256 shares;
        uint256 amount;
        (amount, shares) = bentoBoxInstance.withdraw(
            tokenInstance,
            address(this),
            address(this),
            0,
            bento_box_balance
        );
        //calculate yields
        uint256 yields = shares -
            (group.required_collateral * group.max_member_num); //shares will remain total collateral at this point
        //10% of yields goes to purseFactory admin
        uint256 yields_to_admin = (yields * 10) / 100;
        yields_due_to_members = yields - yields_to_admin;
        tokenInstance.transfer(ADMIN, yields_to_admin);

        returns_due_to_members = shares - yields_to_admin;
    }

    function calculateMissedDonationForUser(address _memberAdress)
        public
        view
        onlyGroupMember(_memberAdress)
        returns (
            address[] memory trimmed_members_who_didnt_donate_for_user,
            uint256
        )
    {
        address[] memory members_who_didnt_donate_for_user = new address[](
            members.length - 1
        );
        //    address[] memory members_list = members;
        uint256 count = 0;

        for (uint256 i = 0; i < members.length; i++) {
            if (
                members[i] != _memberAdress &&
              !has_received_donation[msg.sender][members[i]]
            ) {
                if(count == 0){
                     members_who_didnt_donate_for_user[0] = members[i];
                     count += 1;
                }
                else{
                    members_who_didnt_donate_for_user[count+1] = members[i];
                    count += 1;
                }
               
            }
        }

        // instantiate the return array with the length of number of members who didn't donate for this user
        trimmed_members_who_didnt_donate_for_user = new address[](count);
        for (uint256 j = 0; j < count; j++) {
            if (members_who_didnt_donate_for_user[j] != address(0)) {
                trimmed_members_who_didnt_donate_for_user[
                    j
                ] = members_who_didnt_donate_for_user[j];
            }
        }

        return (
            trimmed_members_who_didnt_donate_for_user,
            trimmed_members_who_didnt_donate_for_user.length *
                group.deposit_amount
        );
    }

    function calculateMissedDonationByUser(address _memberAdress)
        public
        view
        onlyGroupMember(_memberAdress)
        returns (
            address[] memory trimmed_members_who_member_didnt_donate_for,
            uint256
        )
    {
        address[] memory members_who_member_didnt_donate_for = new address[](
            members.length - 1
        );
        //keep count of valid entry of members in the above array,
        uint256 count = 0;

        for (uint256 i = 0; i < members.length; i++) {
            if (
                members[i] != _memberAdress &&
                has_donated_for_member[members[i]][_memberAdress] == false
            ) {

                if(count == 0){
                    members_who_member_didnt_donate_for[0] = (members[i]);
                    count += 1;
                }else{
                    members_who_member_didnt_donate_for[count + 1] = (members[i]);
                    count += 1;
                }
               
            }
        }

        //instantiate the return array with the lenght of number of members who this member didn't donate for
        trimmed_members_who_member_didnt_donate_for = new address[](count);
        for (uint256 j = 0; j < count; j++) {
            if (members_who_member_didnt_donate_for[j] != address(0)) {
                trimmed_members_who_member_didnt_donate_for[
                    j
                ] = members_who_member_didnt_donate_for[j];
            }
        }

        return (
            trimmed_members_who_member_didnt_donate_for,
            trimmed_members_who_member_didnt_donate_for.length *
                group.deposit_amount
        );
    }

    function withdrawCollateralAndYields() public onlyGroupMember(msg.sender) {
        require(block.timestamp >= (group.timeStarted + (group.time_interval * members.length)), 'till purse rounds are completed');
        require(
            hasWithdrawnCollateralAndYield[msg.sender] == false,
            "collateral and yields withdrawn already"
        );

        // calculate the amount of rounds this user missed
        (, uint256 amountToBeDeducted) = calculateMissedDonationByUser(
            msg.sender
        );

        //calculate amount of donatons to user that was missed
        (, uint256 amountToBeAdded) = calculateMissedDonationForUser(
            msg.sender
        );

        uint256 intendedTotalReturnsForUser = (group.required_collateral) +
            (yields_due_to_members / group.max_member_num);

        uint256 finalTotalReturnsToUser = intendedTotalReturnsForUser +
            amountToBeAdded -
            amountToBeDeducted;

        hasWithdrawnCollateralAndYield[msg.sender] = true;
        tokenInstance.transfer(msg.sender, finalTotalReturnsToUser);
    }

    // returns current round details, the member who is meant for the round, current round and time before next round-
    function currentRoundDetails()
        public
        view
        returns (
            address,
            uint256,
            uint256
        )
    {
        require(group.groupState == GroupState.Closed, "rounds yet to start");
        // a round should span for the time of "interval" set upon purse creation

        //calculte how many of the "intervals" is passed to get what _position/round
        uint256 roundPassed = (block.timestamp - group.timeStarted) /
            group.time_interval;

        uint256 currentRound = roundPassed + 1;
        uint256 timeForNextRound = group.timeStarted +
            (currentRound * group.time_interval);

        //current round is equivalent to position
        address _member = positionToMember[currentRound];

        return (_member, currentRound, timeForNextRound);
    }

    function groupMembers() public view returns (address[] memory) {
        return members;
    }
}