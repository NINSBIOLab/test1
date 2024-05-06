'use client'
import Link from "next/link";

export default function DashNav() {
    return (
        <div className="py-2">
            <Link className="inline-block border mr-2 rounded px-3 p-2" href="/dashboard/bill-summery">Bill Summery</Link>
            <Link className="inline-block border mr-2 rounded px-3 p-2" href="/dashboard/refferal-doctor">Refferal Doctor</Link>
            <Link className="inline-block border mr-2 rounded px-3 p-2" href="/dashboard/services">Add Service</Link>
        </div>
    )
}