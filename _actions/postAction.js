'use server'

import connectDB from "../config/database"
import User from "../src/Model/User"

export async function getPosts() {
    try {
        await connectDB();
        return { msg: 'GET' }
    } catch (error) {
        return { errMsg: error.message }
    }
}
