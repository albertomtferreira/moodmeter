#!/bin/bash

# Start Prisma Studio in the background
npx prisma studio &

# Run Next.js development server
npx next dev