// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VeryFaucetNative {
    // VERY 입금: 누구나 컨트랙트 주소로 송금하면 컨트랙트에 쌓임
    receive() external payable {}

    fallback() external payable {}

    // 출금: 누구나 호출 가능, msg.sender에게 지정 금액 송금
    function withdraw(uint256 amount) external {
        require(address(this).balance >= amount, "Insufficient balance");

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdraw failed");
    }

    // 컨트랙트의 VERY 잔액 확인
    function getVaultBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
