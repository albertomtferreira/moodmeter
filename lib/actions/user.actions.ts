import { CreateUserParams } from "@/types"
import User from "../database/models/user.models"
import { connectToDatabase } from "../mongodb"

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase()

    const newUser = await User.create(user)
    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    console.log(error)
  }
}