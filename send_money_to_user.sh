#! /bin/bash

env SMART_CONTRACTS_ENABLED=true ETH_NODE=http://ethnode.chain.cloud:8545 ETH_MAIN_ADDRESS=0x3E35b832Cb9611da764A834B21852956d60B15F4 ETH_CREATOR_ADDRESS=0xb9af8aa42c97f5a1f73c6e1a683c4bf6353b83e7 node scripts/send_money_to_user.js
