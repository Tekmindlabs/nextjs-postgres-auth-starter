import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    // Retrieve the session from Supabase
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      console.error("Unauthorized access attempt:", error);
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Read the request body
    const body = await request.json();

    // Log the body for debugging
    console.log("Received Body in /api/add:", body);

    // Forward the request to the external API
    const response = await fetch("https://api.mem0.ai/v1/memories/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Read the response from the external API
    const data = await response.json();

    // Handle errors from the external API
    if (!response.ok) {
      console.error("External API Error:", data);
      return NextResponse.json(data, { status: response.status });
    }

    // Return the data from the external API
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}