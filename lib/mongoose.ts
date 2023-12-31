import mongoose from 'mongoose'

let isConnected = false // variable to check if mongoose is connected

export const connectToDB = async () => {
  mongoose.set('strictQuery', true)

  if (!process.env.MONGODB_URL) return console.log('MONGODB URL NOT FOUND')
  if (isConnected) return console.log('Connected to MONGODB')

  try {
    await mongoose.connect(process.env.MONGODB_URL)
    isConnected = true
  } catch (error) {
    console.log('error connectToDB', error)
  }
}
