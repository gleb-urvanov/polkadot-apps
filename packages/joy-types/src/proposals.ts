import { Text, u32, Enum, getTypeRegistry, GenericAccountId, u8, Vec, Option, u64, Null } from '@polkadot/types';
import { BlockNumber, Balance } from '@polkadot/types/interfaces';
import { MemberId } from './members';
import { StakeId } from './stake';
import AccountId from '@polkadot/types/primitive/Generic/AccountId';
import { JoyStruct } from './JoyStruct';

export type VotingResults = {
  abstensions: u32;
  approvals: u32;
  rejections: u32;
  slashes: u32;
};

export class VotingResultsImpl extends JoyStruct<VotingResults> {
  constructor(value?: VotingResults) {
    super({
      abstensions: u32,
      approvals: u32,
      rejections: u32,
      slashes: u32,
    }, value);
  }
}

export type ProposalParameters = {
  // During this period, votes can be accepted
  votingPeriod: BlockNumber;

  /* A pause before execution of the approved proposal. Zero means approved proposal would be
     executed immediately. */
  gracePeriod: BlockNumber;

  // Quorum percentage of approving voters required to pass the proposal.
  approvalQuorumPercentage: u32;

  // Approval votes percentage threshold to pass the proposal.
  approvalThresholdPercentage: u32;

  // Quorum percentage of voters required to slash the proposal.
  slashingQuorumPercentage: u32;

  // Slashing votes percentage threshold to slash the proposal.
  slashingThresholdPercentage: u32;

  // Proposal stake
  requiredStake: Option<Balance>;
};

export class ProposalParametersImpl extends JoyStruct<ProposalParameters> {
  constructor(value?: ProposalParameters) {
    super({
      votingPeriod: u32,
      gracePeriod: u32,
      approvalQuorumPercentage: u32,
      approvalThresholdPercentage: u32,
      slashingQuorumPercentage: u32,
      slashingThresholdPercentage: u32,
      requiredStake: Option.with(u64),
      }, value);
  }
}

export type Proposal = {
  parameters: ProposalParametersImpl;
  proposerId: MemberId;
  title: Text;
  description: Text;
  createdAt: BlockNumber;
  status: ProposalStatus;
  votingResults: VotingResultsImpl;
};

// export class ProposalOf extends JoyStruct<Proposal> {
//   constructor(value?: Proposal) {
//     super({
//       parameters: ProposalParametersImpl,
//       proposerId: MemberId,
//       title: Text,
//       description: Text,
//       createdAt: u32,
//       status: ProposalStatus,
//       votingResults: VotingResultsImpl,
//       }, value);
//   }
// }

export type ProposalOf = Proposal;

export const IProposalStatus: { [key: string]: string } = {
  Active: 'Active',
  Canceled: 'Canceled',
  Expired: 'Expired',
  Approved: 'Approved',
  Rejected: 'Rejected',
  Vetoed: 'Vetoed',
  PendingExecution: 'PendingExecution',
  Executed: 'Executed',
  ExecutionFailed: 'ExecutionFailed',
  Finalized: 'Finalized',
  Slashed: 'Slashed'
};

export type IActiveStake = {
  stake_id: StakeId,
  source_account_id: AccountId,
}

export class ActiveStake extends JoyStruct<IActiveStake> {
  constructor(value?: IActiveStake) {
    super({
        stake_id: u32,
        source_account_id: GenericAccountId,
      }, value);
  }
}

export type IExecutionFailed = {
  error: Vec<u8>
}

export class ExecutionFailed extends JoyStruct<IExecutionFailed> {
  constructor(value?: IExecutionFailed) {
    super({
      error: Vec.with(u8)
    }, value)
  }
}

export class ApprovedProposalStatus extends Enum {
  constructor(value?: any) {
    super({PendingExecution: Null, Executed: Null, ExecutionFailed: ExecutionFailed}, value)
  }
}

export type ProposalDecisionStatuses = 'Canceled' | 'Vetoed' | 'Rejected' | 'Slashed' | 'Expired'| ApprovedProposalStatus;  

export class ProposalDecisionStatus extends Enum {
  constructor(value?: any, index?: number) {
    super({
      Canceled: Null, 
      Vetoed: Null, 
      Rejected: Null, 
      Slashed: Null, 
      Expired: Null, 
      Approved: 
      ApprovedProposalStatus
    }, value, index)
  }
}

export type IFinalizationData = {
  proposal_status: ProposalDecisionStatus,
  finalized_at: BlockNumber,
  encoded_unstaking_error_due_to_broken_runtime: Option<Vec<u8>>,
  stake_data_after_unstaking_error: Option<ActiveStake>,
}

export class FinalizationData extends JoyStruct<IFinalizationData> {
  constructor(value?: IFinalizationData) {
    super({
        proposal_status: ProposalDecisionStatus,
        finalized_at: u32,
        encoded_unstaking_error_due_to_broken_runtime: Option.with(Vec.with(u8)),
        stake_data_after_unstaking_error: Option.with(ActiveStake),
      }, value);
  }
}

export class Active extends Option.with(ActiveStake){};
export class Finalized extends FinalizationData{};

export class ProposalStatus extends Enum {
  constructor(value?: any) {
    super({
      Active,
      Finalized,
    }, value);
  }
}

export const VoteKinds: { [key: string]: string } = {
  Abstain: 'Approve',
  Approve: 'Reject',
  Reject: 'Slash',
  Slash: 'Abstain'
};

export class VoteKind extends Enum {
  constructor(value?: any) {
    super(['Approve', 'Reject', 'Slash', 'Abstain'], value);
  }
}

export type ProposalVotes = [MemberId, VoteKind][];

export class ProposalId extends u32 {}

// const proposalTypes = {
//   VoteKind,
//   ProposalStatus
// };

// export default proposalTypes;
export function registerProposalTypes() {
  try {
    getTypeRegistry().register({
      ProposalId,
      ProposalStatus,
      VoteKind,
      ProposalParametersImpl,
      VotingResultsImpl
    });
    getTypeRegistry().register({
      'ProposalParameters': {
        // During this period, votes can be accepted
        votingPeriod: 'BlockNumber',
      
        /* A pause before execution of the approved proposal. Zero means approved proposal would be
           executed immediately. */
        gracePeriod: 'BlockNumber',
      
        // Quorum percentage of approving voters required to pass the proposal.
        approvalQuorumPercentage: 'u32',
      
        // Approval votes percentage threshold to pass the proposal.
        approvalThresholdPercentage: 'u32',
      
        // Quorum percentage of voters required to slash the proposal.
        slashingQuorumPercentage: 'u32',
      
        // Slashing votes percentage threshold to slash the proposal.
        slashingThresholdPercentage: 'u32',
      
        // Proposal stake
        requiredStake: 'Option<Balance>'
      }
    });
    getTypeRegistry().register({
      'VotingResults': {
        abstensions: 'u32',
        approvals: 'u32',
        rejections: 'u32',
        slashes: 'u32'
      }
    });
    getTypeRegistry().register({
      'ProposalOf': {
        parameters: 'ProposalParameters',
        proposerId: 'MemberId',
        title: 'Text',
        description: 'Text',
        createdAt: 'u32',
        status: 'ProposalStatus',
        votingResults: 'VotingResults'
      }
    });
  } catch (err) {
    console.error('Failed to register custom types of proposals module', err);
  }
}
