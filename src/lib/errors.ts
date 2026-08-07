import { NextResponse } from "next/server";

export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "AI_UNAVAILABLE"
  | "AI_EMPTY_RESPONSE"
  | "AI_INVALID_RESPONSE"
  | "AI_PROVIDER_ERROR"
  | "SAFETY_CLASSIFIER_UNAVAILABLE"
  | "PERSISTENCE_FAILED"
  | "INTERNAL_ERROR";

export type AppErrorInit = {
  code: AppErrorCode;
  message: string;
  status: number;
  cause?: unknown;
};

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: number;

  constructor({ code, message, status, cause }: AppErrorInit) {
    super(message, { cause });
    this.name = "AppError";
    this.code = code;
    this.status = status;
  }
}

export function apiFailure(error: AppError, details?: Record<string, unknown>) {
  return NextResponse.json({
    success: false,
    error: {
      code: error.code,
      message: error.message,
    },
    ...details,
  }, { status: error.status });
}

export function toAppError(error: unknown, fallback: AppErrorInit): AppError {
  if (error instanceof AppError) return error;
  return new AppError({ ...fallback, cause: error });
}

export const APP_ERRORS = {
  validation: () => new AppError({
    code: "VALIDATION_ERROR",
    message: "Permintaan tidak valid",
    status: 400,
  }),
  persistence: (cause?: unknown) => new AppError({
    code: "PERSISTENCE_FAILED",
    message: "Operasi belum dapat diproses",
    status: 500,
    cause,
  }),
  safetyUnavailable: (cause?: unknown) => new AppError({
    code: "SAFETY_CLASSIFIER_UNAVAILABLE",
    message: "Pengecekan keselamatan sedang tidak tersedia",
    status: 503,
    cause,
  }),
  internal: (cause?: unknown) => new AppError({
    code: "INTERNAL_ERROR",
    message: "Terjadi kendala teknis. Coba lagi nanti.",
    status: 500,
    cause,
  }),
} as const;
