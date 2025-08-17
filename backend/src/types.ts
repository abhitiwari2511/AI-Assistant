
export interface UserType {
    fullName: string;
    email: string;
    password: string;
    assistantName?: string;
    refreshToken?: string;
    history: string[];
}

export interface UserMethods {
    isPasswordCorrect: (password: string) => Promise<boolean>;
    generateAccessToken: () => string;
    generateRefreshToken: () => string;
}
