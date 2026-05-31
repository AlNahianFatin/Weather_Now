import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { rateLimiter } from '../../../utils/rateLimiter';
import { getUserIP } from '../../../utils/ip';

export async function GET(request: NextRequest) {
    try {
        const userIP = await getUserIP();
        const { searchParams } = new URL(request.url);
        const place = searchParams.get('place');

        if (!place) {
            return NextResponse.json(
                { error: 'Please enter a city name' },
                { status: 400 }
            );
        }

        // Check rate limit
        try {
            await rateLimiter.consume(userIP, 1);
        }
        catch (error: any) {
            console.log('Rate limit exceeded for IP:', userIP);
            const retryAfter = Math.ceil(error.msBeforeNext / 1000) || 60;

            return NextResponse.json(
                {
                    error: 'Too many requests. Please try again later.',
                    retryAfter: retryAfter,
                    rateLimited: true // Add flag to indicate rate limit
                },
                { status: 429, headers: { 'Retry-After': retryAfter.toString() } }
            );
        }

        // Fetch weather data
        const { data } = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
        );

        return NextResponse.json(data);
    }
    catch (error: any) {
        console.error('Weather API Error:', error.message);

        if (error.response?.status === 404) {
            return NextResponse.json(
                { error: 'City not found. Please check the spelling and try again.' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to fetch weather data. Please try again.' },
            { status: 500 }
        );
    }
}