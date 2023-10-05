// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract DigitalAssetMarket {
    address public manager;

    struct DigitalAsset {
        uint256 ownerId;
        string name;
        string description;
        uint256 price;
        string category;
        bool isAvailable;
    }


    struct UserInfo {
        string name;
        string email;
        address payable wallet;
        uint256[] ownedAssetIds;

    }

    struct TransactionHistory {
        uint256 asssetId;
        uint256 buyerId;
        uint256 purchaseTime;
    }


    constructor() {
        manager = msg.sender;

    }

    modifier onlyManager {
        require(msg.sender == manager);
        _;
    }


    mapping(uint256 => DigitalAsset) public digitalAssets;
    mapping(uint256 => UserInfo) public users;
    mapping(address => uint256) public userWallets;
    mapping(uint256 => TransactionHistory[]) public transactionHistory;



    function createDigitalAsset(
        uint256 assetId,
        uint256 ownerId,
        string memory name,
        string memory description,
        uint256 price,
        string memory category
    ) public onlyManager {
        digitalAssets[assetId] = DigitalAsset(ownerId,name, description, price, category, true);
        users[ownerId].ownedAssetIds.push(assetId);
    }


    function createUser(
        uint256 userId,
        string memory name,
        string memory email,
        address payable wallet
    ) public onlyManager {
        users[userId] = UserInfo(name,email,wallet, new uint256[](0));
        userWallets[wallet] = userId;
    }


    function purchaseDigitalAsset(uint256 assetId) public payable {
        require(digitalAssets[assetId].isAvailable, "Asset is not available for sale");
        require(msg.value >= digitalAssets[assetId].price, "Insufficient funds");

        uint buyerId = userWallets[msg.sender];
        uint previousOwnerId = digitalAssets[assetId].ownerId;
        // forward money to asset's owner
        users[previousOwnerId].wallet.transfer(msg.value);
        // remove the asset from the owner's asset list
        removeValueFromArray(users[previousOwnerId].ownedAssetIds,assetId);
        // transfer the ownership to the buyer
        digitalAssets[assetId].ownerId = buyerId;
        // add the asset to the buyer's asset list
        users[buyerId].ownedAssetIds.push(assetId);

        digitalAssets[assetId].isAvailable = false;
        // add a new transaction to history
        transactionHistory[buyerId].push(TransactionHistory(assetId,buyerId,block.timestamp));

    }


    function getUserAsset(uint256 userId) public view returns (uint256[] memory)  {
        return users[userId].ownedAssetIds;
    }

    function getUserTransactionHistory(uint256 userId) public view returns (TransactionHistory[] memory)  {
        return transactionHistory[userId];
    }

    function removeValueFromArray(uint256[] storage arr, uint256 value) private {
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i] == value) {
                if (i != arr.length - 1) {
                    arr[i] = arr[arr.length - 1];
                }
                arr.pop();
                break;
            }
        }
    }



}