
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apps = await prisma.app.findMany({
      where: { userId: session.user.id },
      orderBy: { position: "asc" },
    });

    return NextResponse.json(apps);
  } catch (error) {
    console.error("Error fetching apps:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, url, icon, category, description } = await req.json();

    if (!name || !url) {
      return NextResponse.json(
        { error: "Name and URL are required" },
        { status: 400 }
      );
    }

    // Get the highest position for ordering
    const lastApp = await prisma.app.findFirst({
      where: { userId: session.user.id },
      orderBy: { position: "desc" },
    });

    const app = await prisma.app.create({
      data: {
        userId: session.user.id,
        name,
        url,
        icon,
        category,
        description,
        position: (lastApp?.position ?? 0) + 1,
      },
    });

    return NextResponse.json(app);
  } catch (error) {
    console.error("Error creating app:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
