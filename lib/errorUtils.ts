// lib/errorUtils.ts
import { Prisma } from '@prisma/client';

export function handlePrismaError(error: Prisma.PrismaClientKnownRequestError) {
  switch (error.code) {
    case 'P2002':
      return {
        error: 'Conflict',
        message: 'A record with this value already exists',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    case 'P2025':
      return {
        error: 'Not Found',
        message: 'Record not found',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    default:
      return {
        error: 'Database Error',
        message: 'An error occurred while accessing the database',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
  }
}

export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export function isPrismaError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

export function formatError(error: unknown) {
  if (isPrismaError(error)) {
    return handlePrismaError(error);
  }

  if (isError(error)) {
    return {
      error: error.name || 'Error',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }

  return {
    error: 'Unknown Error',
    message: String(error),
    details: process.env.NODE_ENV === 'development' ? String(error) : undefined
  };
}