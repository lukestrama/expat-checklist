import { NextRequest, NextResponse } from 'next/server'
import { getChecklistFromOpenAI } from '../../utils/openai'

export async function POST(request: NextRequest) {
  try {
    const { originCountry, destination } = await request.json()
    
    if (!originCountry || !destination) {
      return NextResponse.json(
        { error: 'Origin and destination are required' },
        { status: 400 }
      )
    }
    
    const response = await getChecklistFromOpenAI({ originCountry, destination })
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error generating checklist:', error)
    return NextResponse.json(
      { error: 'Failed to generate checklist' },
      { status: 500 }
    )
  }
}