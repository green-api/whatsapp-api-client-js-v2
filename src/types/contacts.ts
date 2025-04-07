export interface CheckWhatsapp {
    phoneNumber: number;
}

export interface CheckWhatsappResponse {
    existsWhatsapp: boolean;
}

export interface GetAvatar {
    chatId: string;
}

export interface GetAvatarResponse {
    urlAvatar: string;
    available: boolean;
}

export type ContactType = "user" | "group";

export interface Contact {
    id: string;
    name: string;
    contactName: string;
    type: ContactType;
}

export interface ProductImageUrls {
    requested: string;
    original: string;
}

export interface ProductReviewStatus {
    whatsapp: string;
}

export interface Product {
    id: string;
    imageUrls: ProductImageUrls;
    reviewStatus: ProductReviewStatus;
    availability: string;
    name: string;
    description?: string;
    price: string | null;
    isHidden: boolean;
}

export interface ContactInfo {
    avatar: string;
    name: string;
    contactName: string;
    email: string;
    category: string;
    description: string;
    products: Product[];
    chatId: string;
    lastSeen: string | null;
    isArchive: boolean;
    isDisappearing: boolean;
    isMute: boolean;
    messageExpiration: number;
    muteExpiration: number | null;
    isBusiness: boolean;
}

export interface ArchiveChat {
    chatId: string;
}

export interface UnarchiveChat {
    chatId: string;
}

export type EphemeralExpiration = 0 | 86400 | 604800 | 7776000;

export interface SetDisappearingChat {
    chatId: string;
    ephemeralExpiration: EphemeralExpiration;
}

export interface SetDisappearingChatResponse {
    chatId: string;
    disappearingMessagesInChat: boolean;
    ephemeralExpiration: EphemeralExpiration;
}
