import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domain = (searchParams.get("domain") || "").trim();
  if (!domain) {
    return NextResponse.json({ success: false, error: "domain is required" }, { status: 400 });
  }
  try {
    const rdapUrl = `https://rdap.org/domain/${encodeURIComponent(domain)}`;
    const res = await fetch(rdapUrl, { headers: { "accept": "application/rdap+json, application/json" }, cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ success: false, error: `RDAP error ${res.status}` }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json({ success: true, domain, data });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Unknown error" }, { status: 500 });
  }
}


