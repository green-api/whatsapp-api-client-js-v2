export interface CreateGroup {
    groupName: string;
    chatIds: string[];
}

export interface CreateGroupResponse {
    created: boolean;
    chatId: string;
    groupInviteLink: string;
}

export interface UpdateGroupName {
    groupId: string;
    groupName: string;
}

export interface UpdateGroupNameResponse {
    updateGroupName: boolean;
}

export interface GroupParticipant {
    id: string;
    isAdmin: boolean;
    isSuperAdmin: boolean;
}

export interface GroupData {
    groupId: string;
    owner: string;
    subject: string;
    creation: number;
    participants: GroupParticipant[];
    subjectTime: number;
    subjectOwner: string;
    groupInviteLink: string;
}

export interface GetGroupData {
    groupId: string;
}

export interface AddGroupParticipant {
    groupId: string;
    participantChatId: string;
}

export interface AddGroupParticipantResponse {
    addParticipant: boolean;
}

export interface RemoveGroupParticipant {
    groupId: string;
    participantChatId: string;
}

export interface RemoveGroupParticipantResponse {
    removeParticipant: boolean;
}

export interface SetGroupAdmin {
    groupId: string;
    participantChatId: string;
}

export interface SetGroupAdminResponse {
    setGroupAdmin: boolean;
}

export interface RemoveAdmin {
    groupId: string;
    participantChatId: string;
}

export interface RemoveAdminResponse {
    removeAdmin: boolean;
}

export interface SetGroupPicture {
    groupId: string;
    file: Blob | File;
}

export interface SetGroupPictureResponse {
    setGroupPicture: boolean;
    urlAvatar: string | null;
    reason: string;
}

export interface LeaveGroup {
    groupId: string;
}

export interface LeaveGroupResponse {
    leaveGroup?: boolean;
    removeAdmin?: boolean;
}
