// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

pragma solidity ^0.4.14;
library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }
    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }
    /// @return the generator of G1
    function P1() pure internal returns (G1Point) {
        return G1Point(1, 2);
    }
    /// @return the generator of G2
    function P2() pure internal returns (G2Point) {
        return G2Point(
            [11559732032986387107991004021392285783925812861821192530917403151452391805634,
            10857046999023057135944570762232829481370756359578518086990519993285655852781],
            [4082367875863433681332203403145435568316851327593401208105741076214120093531,
            8495653923123431417604973247489272438418190587263600148770280649306958101930]
        );
    }
    /// @return the negation of p, i.e. p.addition(p.negate()) should be zero.
    function negate(G1Point p) pure internal returns (G1Point) {
        // The prime q in the base field F_q for G1
        uint q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0)
            return G1Point(0, 0);
        return G1Point(p.X, q - (p.Y % q));
    }
    /// @return the sum of two points of G1
    function addition(G1Point p1, G1Point p2) internal returns (G1Point r) {
        uint[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        assembly {
            success := call(sub(gas, 2000), 6, 0, input, 0xc0, r, 0x60)
        // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
    }
    /// @return the product of a point on G1 and a scalar, i.e.
    /// p == p.scalar_mul(1) and p.addition(p) == p.scalar_mul(2) for all points p.
    function scalar_mul(G1Point p, uint s) internal returns (G1Point r) {
        uint[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        assembly {
            success := call(sub(gas, 2000), 7, 0, input, 0x80, r, 0x60)
        // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require (success);
    }
    /// @return the result of computing the pairing check
    /// e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
    /// For example pairing([P1(), P1().negate()], [P2(), P2()]) should
    /// return true.
    function pairing(G1Point[] p1, G2Point[] p2) internal returns (bool) {
        require(p1.length == p2.length);
        uint elements = p1.length;
        uint inputSize = elements * 6;
        uint[] memory input = new uint[](inputSize);
        for (uint i = 0; i < elements; i++)
        {
            input[i * 6 + 0] = p1[i].X;
            input[i * 6 + 1] = p1[i].Y;
            input[i * 6 + 2] = p2[i].X[0];
            input[i * 6 + 3] = p2[i].X[1];
            input[i * 6 + 4] = p2[i].Y[0];
            input[i * 6 + 5] = p2[i].Y[1];
        }
        uint[1] memory out;
        bool success;
        assembly {
            success := call(sub(gas, 2000), 8, 0, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
        // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
        return out[0] != 0;
    }
    /// Convenience method for a pairing check for two pairs.
    function pairingProd2(G1Point a1, G2Point a2, G1Point b1, G2Point b2) internal returns (bool) {
        G1Point[] memory p1 = new G1Point[](2);
        G2Point[] memory p2 = new G2Point[](2);
        p1[0] = a1;
        p1[1] = b1;
        p2[0] = a2;
        p2[1] = b2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for three pairs.
    function pairingProd3(
        G1Point a1, G2Point a2,
        G1Point b1, G2Point b2,
        G1Point c1, G2Point c2
    ) internal returns (bool) {
        G1Point[] memory p1 = new G1Point[](3);
        G2Point[] memory p2 = new G2Point[](3);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for four pairs.
    function pairingProd4(
        G1Point a1, G2Point a2,
        G1Point b1, G2Point b2,
        G1Point c1, G2Point c2,
        G1Point d1, G2Point d2
    ) internal returns (bool) {
        G1Point[] memory p1 = new G1Point[](4);
        G2Point[] memory p2 = new G2Point[](4);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p1[3] = d1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        p2[3] = d2;
        return pairing(p1, p2);
    }
}
contract Verifier {
    using Pairing for *;
    struct VerifyingKey {
        Pairing.G2Point A;
        Pairing.G1Point B;
        Pairing.G2Point C;
        Pairing.G2Point gamma;
        Pairing.G1Point gammaBeta1;
        Pairing.G2Point gammaBeta2;
        Pairing.G2Point Z;
        Pairing.G1Point[] IC;
    }
    struct Proof {
        Pairing.G1Point A;
        Pairing.G1Point A_p;
        Pairing.G2Point B;
        Pairing.G1Point B_p;
        Pairing.G1Point C;
        Pairing.G1Point C_p;
        Pairing.G1Point K;
        Pairing.G1Point H;
    }
    function verifyingKey() pure internal returns (VerifyingKey vk) {
        vk.A = Pairing.G2Point([0x2ea7264b7873c784e2776ca607cc2dfc5eb314c9f517f56eb3f99cb6b866fed7, 0x2d2d312f286924a1fbf34f94cf4e1432f0af622031dd7e2df4acec2eb1b1764c], [0x1ce07260e040b4d16384b40f1b8bf2d896b0e962a73c1fa504cf8f6cf648b326, 0x2dc4cad0291d6eaab5b17b3aab56b984c2732dc0cfc1196bdb0c9987ecd2e2fa]);
        vk.B = Pairing.G1Point(0xf45c3850448d3a977f2a5b1899c20457c502d7628a5f927aaa5193a72eeaa36, 0x15775faa65edbcefeefe9c17875e9fe4dea2ae93d235a1d3d1755554a6cbad54);
        vk.C = Pairing.G2Point([0x11ec3e15fdf7c704302f3eb73ce3729bd3255f140fa2bb5ddf67b6746b1a644b, 0x16a11fd6d13b5a27f58e93a8bcaf0c2eb6c3c2699baf6a7a10b5065793af6272], [0x209e0e696d75d7f2020b72d99c41b0c51e234500acf099e1b5f4f6bc51e9d8d2, 0x4afc0794ee39b5ab2bbd200748b239cf0c15de769722a62d1f8d540b1f69360]);
        vk.gamma = Pairing.G2Point([0x28fd1a1d212cead52de5298bc51aa059d68f9e98cb9b9039dc15dd1335518083, 0x2c3dbd786b3711724a54f3b598d328afcc80a1a726427f83fcd0cb2024635270], [0x1acbeeeaaff9b953923c1dceae0862aa7f09f3acf9509b250549341485824e03, 0xfa2f1f67c00fe0eb96e3f0a466b9aa07e470097f50490be85957ca757e4204f]);
        vk.gammaBeta1 = Pairing.G1Point(0x12fd3abf30f4490738f85cfe0e6efcd52efcdd96a20cbb2a03dafbfddfb7e500, 0x28fdb966dd15c4161988afa223129be8a4855be2622392dfe054ac7b6e44fa5e);
        vk.gammaBeta2 = Pairing.G2Point([0x1630dc99759b44319899e0022b386f41a5c39fc06ae822643926e326f6a16082, 0xc043d2e30d32cbadef8ef8b454161ea4afed82847452062078d2ad3acc95e15], [0x241d52ca67798c2c4baa75f312225407c6964d70fe910d24e7650fe64f484f5d, 0x21f30784ea3ca9ad2bf07618920ed547593dc3b9b01f97d4a4e3708564a0d49]);
        vk.Z = Pairing.G2Point([0x1011c44ca29b776d94582c4be925b0c847cfb240b6a91dc6f488eb3aab64beb, 0x1a00e3b3fa4ae0031bba286f741c3793c1ff3a2fee5c34def8a48872c65fc2ec], [0x24da271d32a5580135d1bc6b199588b6c0876ddfcc749188160a00c18fe84e80, 0x2197057262a41b5ae5f0bc9aa617e17a2cc1ae0bf67384e0a572090e8670c6e8]);
        vk.IC = new Pairing.G1Point[](3);
        vk.IC[0] = Pairing.G1Point(0x292eb03ef5f604e22999e273b90670ba2b1e085cc7cb5b46cccffb1c0b9d3a84, 0x2a265523f08622ed7806d660bc7db0b2effcd2ab7bde4c0513154fd964a76be0);
        vk.IC[1] = Pairing.G1Point(0x8228e30fdb2b0d6ad52f63739bb9da1a944d982b0dbfb440816e3cb9f0adb68, 0x1cb3412ee60e29a71ba2c2b8c305ec5ddae047b69f0a61d7d0070f02d9b6e4df);
        vk.IC[2] = Pairing.G1Point(0x237bbae17f1d9fe318e4e5636f5c8136ef0bff4a3f89a2866a8a1580c9a2b3b4, 0xe4ea6b66fb56b9bfbdbac179d3283fc6db1cd6ce0e9a4d29810badffb170c68);
    }
    function verify(uint[] input, Proof proof) internal returns (uint) {
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.IC.length);
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++)
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.IC[i + 1], input[i]));
        vk_x = Pairing.addition(vk_x, vk.IC[0]);
        if (!Pairing.pairingProd2(proof.A, vk.A, Pairing.negate(proof.A_p), Pairing.P2())) return 1;
        if (!Pairing.pairingProd2(vk.B, proof.B, Pairing.negate(proof.B_p), Pairing.P2())) return 2;
        if (!Pairing.pairingProd2(proof.C, vk.C, Pairing.negate(proof.C_p), Pairing.P2())) return 3;
        if (!Pairing.pairingProd3(
            proof.K, vk.gamma,
            Pairing.negate(Pairing.addition(vk_x, Pairing.addition(proof.A, proof.C))), vk.gammaBeta2,
            Pairing.negate(vk.gammaBeta1), proof.B
        )) return 4;
        if (!Pairing.pairingProd3(
            Pairing.addition(vk_x, proof.A), proof.B,
            Pairing.negate(proof.H), vk.Z,
            Pairing.negate(proof.C), Pairing.P2()
        )) return 5;
        return 0;
    }
    event Verified(string s);
    function verifyTx(
        uint[2] a,
        uint[2] a_p,
        uint[2][2] b,
        uint[2] b_p,
        uint[2] c,
        uint[2] c_p,
        uint[2] h,
        uint[2] k,
        uint[2] input
    ) public returns (bool r) {
        Proof memory proof;
        proof.A = Pairing.G1Point(a[0], a[1]);
        proof.A_p = Pairing.G1Point(a_p[0], a_p[1]);
        proof.B = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
        proof.B_p = Pairing.G1Point(b_p[0], b_p[1]);
        proof.C = Pairing.G1Point(c[0], c[1]);
        proof.C_p = Pairing.G1Point(c_p[0], c_p[1]);
        proof.H = Pairing.G1Point(h[0], h[1]);
        proof.K = Pairing.G1Point(k[0], k[1]);
        uint[] memory inputValues = new uint[](input.length);
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            emit Verified("Transaction successfully verified.");
            return true;
        } else {
            return false;
        }
    }
}
