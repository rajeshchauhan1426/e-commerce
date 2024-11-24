import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    const body = await request.json();
    const { email, name, password } = body;

   
    const existingUser = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (existingUser) {
        return NextResponse.json(
            { error: "Email is already taken" },
            { status: 400 }
        );
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        // Create a new user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword,
            },
        });

        // Return the newly created user
        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
