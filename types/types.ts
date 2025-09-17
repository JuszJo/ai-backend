export interface Payload {
  phoneNumber: string,
  email?: string | null,
  role?: string,
  fullName?: string | null | undefined,
  id: string,
  uuid: string,
  iat?: number,
  exp?: number
}

export interface VerifiedPayload {
  phoneNumber: string,
  email?: string | null,
  role?: string | null | undefined,
  id: string,
  uuid: string,
  fullName?: string | null | undefined,
}