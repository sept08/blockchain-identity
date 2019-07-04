pragma solidity >=0.4.24;

contract myToken {

    string public constant name = "Udacity Token";
    string public constant symbol = "UDC";
    uint8 public constant decimals = 18;  // 18 is the most common number of decimal places
    uint _totalSupply;

    // 使用mapping存储每个账户的余额
    mapping(address => uint256) balances;

    // 账户的限额关系
    mapping(address => mapping (address => uint256)) allowance;

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);

    constructor(uint amount) public {
        _totalSupply = amount;
        balances[msg.sender] = amount;
    }

    // 代币的总储量
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    // 根据代币所有者的地址，查询其代币余额。
    function balanceOf(address tokenOwner) public constant returns (uint balance) {
        return balances[tokenOwner];
    }

    // 由账户所有者向另一账户进行代币转账
    function transfer(address to, uint tokens) public returns (bool success) {
        // 代币不足的异常处理
        if(tokens < 1){
            revert("Not enough Ether provided.");
        }
        // 转账的代币数量应当小于等于当前账户的余额，否则
        require(tokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender] - tokens;
        balances[to] = balances[to] + tokens;
        // 触发转账事件
        emit Transfer(msg.sender, to, tokens);
        return true;
    }

    // 发送一定数量的代币
    // The transferFrom method is used to allow contracts to spend tokens on your behalf
    // Emits Transfer event
    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        balances[from] = balances[from] - tokens;
        allowance[from][msg.sender] = allowance[from][msg.sender] - tokens;
        balances[to] = balances[to] + tokens;
        // 触发转账事件
        emit Transfer(from, to, tokens);
        return true;
    }

    // 批准 spender 多次从您的账户中提款，直到达到限额 tokens。
    function approve(address spender, uint tokens) public returns (bool success) {
        allowance[msg.sender][spender] = tokens;
        // 触发授权批准事件
        emit Approval(msg.sender, spender, tokens);
        return true;
    }
}
