import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";





type EagerYearResult = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<YearResult, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly stationaryCombustion?: number | null;
  readonly mobileCombustion?: number | null;
  readonly fugitiveEmmission?: number | null;
  readonly PurchasedElectricity?: number | null;
  readonly Refrigerants?: number | null;
  readonly NaturalGas?: number | null;
  readonly userID: string;
  readonly groupID?: string | null;
  readonly Year: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyYearResult = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<YearResult, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly stationaryCombustion?: number | null;
  readonly mobileCombustion?: number | null;
  readonly fugitiveEmmission?: number | null;
  readonly PurchasedElectricity?: number | null;
  readonly Refrigerants?: number | null;
  readonly NaturalGas?: number | null;
  readonly userID: string;
  readonly groupID?: string | null;
  readonly Year: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type YearResult = LazyLoading extends LazyLoadingDisabled ? EagerYearResult : LazyYearResult

export declare const YearResult: (new (init: ModelInit<YearResult>) => YearResult) & {
  copyOf(source: YearResult, mutator: (draft: MutableModel<YearResult>) => MutableModel<YearResult> | void): YearResult;
}

type EagerGroup = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Group, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Users?: (YearResult | null)[] | null;
  readonly adminID?: string | null;
  readonly name: string;
  readonly Results?: (YearResult | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyGroup = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Group, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Users: AsyncCollection<YearResult>;
  readonly adminID?: string | null;
  readonly name: string;
  readonly Results: AsyncCollection<YearResult>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Group = LazyLoading extends LazyLoadingDisabled ? EagerGroup : LazyGroup

export declare const Group: (new (init: ModelInit<Group>) => Group) & {
  copyOf(source: Group, mutator: (draft: MutableModel<Group>) => MutableModel<Group> | void): Group;
}

type EagerAdmin = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Admin, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Manages?: (Group | null)[] | null;
  readonly name: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyAdmin = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Admin, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Manages: AsyncCollection<Group>;
  readonly name: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Admin = LazyLoading extends LazyLoadingDisabled ? EagerAdmin : LazyAdmin

export declare const Admin: (new (init: ModelInit<Admin>) => Admin) & {
  copyOf(source: Admin, mutator: (draft: MutableModel<Admin>) => MutableModel<Admin> | void): Admin;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly email: string;
  readonly Results?: (YearResult | null)[] | null;
  readonly isLeader: boolean;
  readonly groupID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly email: string;
  readonly Results: AsyncCollection<YearResult>;
  readonly isLeader: boolean;
  readonly groupID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}