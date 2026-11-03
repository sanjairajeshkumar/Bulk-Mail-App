
import axios from "axios"
import { useState } from "react"
import * as XLSX from "xlsx"

function App() {

  const [msg, setmsg] = useState("")
  const [status, setstatus] = useState(false)
  const [emailList, setEmailList] = useState([])

  function handlemsg(evt) {
    setmsg(evt.target.value)
  }

  function handlefile(event) {

    const file = event.target.files[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = function (event) {

      try {

        const data = event.target.result

        const workbook = XLSX.read(data, { type: "array" })

        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        const excelData = XLSX.utils.sheet_to_json(
          worksheet,
          { header: "A" }
        )

        const totalemail = excelData
          .map(function (item) {
            return String(item.A || "").trim()
          })
          .filter(function (email) {
            return email.length > 0
          })

        setEmailList(totalemail)

        console.log(totalemail)

      } catch (error) {

        console.log(error)
        alert("Unable to read Excel file")
        setEmailList([])

      }

    }

    reader.readAsArrayBuffer(file)

  }

  async function send() {

    if (!msg.trim()) {
      alert("Please enter an email message")
      return
    }

    if (emailList.length === 0) {
      alert("Please upload an Excel file")
      return
    }

    setstatus(true)

    try {

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/sendemail`,
        {
          msg: msg,
          emailList: emailList
        }
      )

      if (response.data.success) {

        alert("Email sent successfully")

      } else {

        alert("Failed to send emails")

      }

    } catch (error) {

      console.log(error)

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      )

    } finally {

      setstatus(false)

    }

  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-800">

      {/* Background */}
      <div className="fixed inset-0 -z-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl"></div>
        <div className="absolute -left-40 top-96 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl"></div>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-xl font-black text-white shadow-lg shadow-indigo-200">
              B
            </div>

            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
                BulkMail
              </h1>
              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-slate-400">
                Campaign Studio
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <span className="text-sm font-medium text-indigo-600">
              Campaign Builder
            </span>
            <span className="text-sm font-medium text-slate-400">
              Email Marketing
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-emerald-700">
              Workspace
            </span>
          </div>

        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">

        {/* Page Heading */}
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span>WORKSPACE</span>
              <span>/</span>
              <span className="text-indigo-600">NEW CAMPAIGN</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Create your campaign.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Design your message, import your audience and reach everyone
              through one simple campaign.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-lg text-indigo-600">
              ✦
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">
                CAMPAIGN TYPE
              </p>
              <p className="mt-0.5 text-sm font-bold text-slate-800">
                Bulk Email
              </p>
            </div>
          </div>

        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">

          {/* Campaign Form */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_35px_rgba(15,23,42,0.04)]">

            {/* Card Header */}
            <div className="border-b border-slate-100 px-6 py-6 sm:px-8">

              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px] text-indigo-600">
                    STEP 01
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-slate-900">
                    Campaign setup
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Configure your content and recipient list.
                  </p>
                </div>

                <div className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-600">
                  NEW
                </div>
              </div>

            </div>

            <div className="space-y-8 p-6 sm:p-8">

              {/* Message Section */}
              <div>

                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-800">
                    Email Content
                  </label>

                  <span className="text-xs font-medium text-slate-400">
                    Message
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 transition duration-200 focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10">

                  <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>

                    <span className="ml-2 text-xs font-medium text-slate-400">
                      Compose your message
                    </span>
                  </div>

                  <textarea
                    onChange={handlemsg}
                    value={msg}
                    className="h-44 w-full resize-y bg-transparent px-5 py-5 text-sm leading-7 text-slate-800 outline-none placeholder:text-slate-400"
                    placeholder="Write a professional email message to your audience..."
                  ></textarea>

                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Keep your message clear, engaging and professional.
                </p>

              </div>

              {/* Upload Section */}
              <div>

                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      Import Recipients
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      Upload your Excel recipient list.
                    </p>
                  </div>

                  <div className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    XLSX / Excel
                  </div>
                </div>

                <div className="group rounded-2xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-indigo-50/40 px-5 py-10 text-center transition duration-300 hover:border-indigo-400 hover:bg-indigo-50/50 sm:py-12">

                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-100 bg-white text-3xl shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                    📊
                  </div>

                  <h4 className="text-base font-bold text-slate-800">
                    Upload your email database
                  </h4>

                  <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-slate-500">
                    Choose an Excel file containing your recipient email addresses.
                  </p>

                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handlefile}
                    className="mx-auto mt-7 block w-full max-w-sm cursor-pointer rounded-lg border border-slate-200 bg-white text-xs text-slate-500 shadow-sm file:mr-4 file:cursor-pointer file:border-0 file:bg-indigo-600 file:px-5 file:py-3 file:font-semibold file:text-white hover:file:bg-indigo-700"
                  />

                  <div className="mt-5 flex flex-wrap justify-center gap-3 text-[11px] font-medium text-slate-400">
                    <span>✓ Excel supported</span>
                    <span>•</span>
                    <span>✓ Easy import</span>
                    <span>•</span>
                    <span>✓ Multiple recipients</span>
                  </div>

                </div>

              </div>

              {/* Recipient Stats */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-5">

                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total Recipients
                    </p>

                    <span className="text-lg">✉</span>
                  </div>

                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-4xl font-extrabold tracking-tight text-indigo-700">
                      {emailList.length}
                    </span>
                    <span className="pb-1 text-xs font-medium text-slate-500">
                      Emails
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Addresses detected in your Excel file.
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Campaign Channel
                    </p>

                    <span className="text-lg">↗</span>
                  </div>

                  <h4 className="mt-4 text-lg font-bold text-slate-800">
                    Email Delivery
                  </h4>

                  <p className="mt-2 text-xs text-slate-500">
                    Multiple recipients through one campaign.
                  </p>

                </div>

              </div>

              {/* Action */}
              <div className="border-t border-slate-100 pt-6">

                <button
                  onClick={send}
                  disabled={status}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition duration-300 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-blue-800 hover:shadow-xl hover:shadow-indigo-200 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span>{status ? "Sending..." : "Send Campaign"}</span>
                  <span className="text-lg transition duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>

                <p className="mt-4 text-center text-xs text-slate-400">
                  Review your campaign details before sending.
                </p>

              </div>

            </div>

          </section>

          {/* Right Sidebar */}
          <aside className="space-y-5">

            {/* Overview */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_35px_rgba(15,23,42,0.04)]">

              <div className="border-b border-slate-100 px-6 py-5">
                <h3 className="text-base font-bold text-slate-900">
                  Campaign Overview
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Your campaign at a glance.
                </p>
              </div>

              <div className="space-y-5 p-6">

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Campaign type
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    Bulk Email
                  </span>
                </div>

                <div className="h-px bg-slate-100"></div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Recipients
                  </span>
                  <span className="text-sm font-bold text-indigo-600">
                    {emailList.length}
                  </span>
                </div>

                <div className="h-px bg-slate-100"></div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Content
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    Message
                  </span>
                </div>

                <div className="h-px bg-slate-100"></div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    File format
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    Excel
                  </span>
                </div>

              </div>

            </div>

            {/* Quick Guide */}
            <div className="rounded-2xl bg-gradient-to-br from-[#172554] via-[#1e40af] to-[#4338ca] p-6 text-white shadow-xl shadow-indigo-200/50">

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-2xl">
                ✦
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[2px] text-indigo-200">
                QUICK GUIDE
              </p>

              <h3 className="mt-3 text-xl font-bold leading-7">
                Launch your email campaign in three steps.
              </h3>

              <div className="mt-7 space-y-5">

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-xs font-bold">
                    01
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      Compose
                    </p>
                    <p className="mt-1 text-xs leading-5 text-indigo-200">
                      Write your email content.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-xs font-bold">
                    02
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      Import
                    </p>
                    <p className="mt-1 text-xs leading-5 text-indigo-200">
                      Upload your Excel recipient list.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-xs font-bold">
                    03
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      Send
                    </p>
                    <p className="mt-1 text-xs leading-5 text-indigo-200">
                      Start your email campaign.
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Support Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-lg">
                  💡
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Helpful Tip
                  </h4>
                  <p className="text-xs text-slate-400">
                    Before sending
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-6 text-slate-500">
                Make sure your Excel file contains valid email addresses
                and your message is ready before launching the campaign.
              </p>

            </div>

          </aside>

        </div>

        {/* Footer */}
        <footer className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-7 text-center sm:flex-row sm:text-left">

          <div>
            <p className="text-sm font-bold text-slate-700">
              BulkMail
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Simplifying business communication.
            </p>
          </div>

          <p className="text-xs text-slate-400">
            © 2026 BulkMail. All rights reserved.
          </p>

        </footer>

      </main>

    </div>
  )
}

export default App
