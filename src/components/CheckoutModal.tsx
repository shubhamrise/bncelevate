import React, { useState } from 'react';
import { Currency, EnrollmentOrder } from '../types';
import { PACKAGES } from '../data/ciaData';
import { X, Check, ShieldCheck, CreditCard, QrCode, Building, Clock, Download, ArrowRight, Sparkles } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackageId?: string;
  currency: Currency;
  onEnrollSuccess?: (order: EnrollmentOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPackageId = 'premium',
  currency,
  onEnrollSuccess
}) => {
  const [activePackageId, setActivePackageId] = useState<string>(selectedPackageId);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Add-ons
  const [printedBooks, setPrintedBooks] = useState(true);
  const [oneOnOneMentoring, setOneOnOneMentoring] = useState(false);
  const [aiAuditLab, setAiAuditLab] = useState(activePackageId === 'premium-plus');

  // Student Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState("Bachelor's Degree");
  const [city, setCity] = useState('');

  // Payment Selection
  const [paymentPlan, setPaymentPlan] = useState<'full' | 'emi'>('full');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wire'>('upi');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);

  // Final Order State
  const [completedOrder, setCompletedOrder] = useState<EnrollmentOrder | null>(null);

  if (!isOpen) return null;

  const currentPkg = PACKAGES.find((p) => p.id === activePackageId) || PACKAGES[1];

  const basePrice = currency === 'INR' ? currentPkg.priceINR : currentPkg.priceUSD;
  const booksCost = printedBooks && activePackageId === 'basic' ? (currency === 'INR' ? 4500 : 55) : 0;
  const mentorCost = oneOnOneMentoring ? (currency === 'INR' ? 8000 : 100) : 0;
  const aiLabCost = aiAuditLab && activePackageId !== 'premium-plus' ? (currency === 'INR' ? 12000 : 150) : 0;
  const subtotal = basePrice + booksCost + mentorCost + aiLabCost;

  const discountAmount = couponApplied ? Math.round(subtotal * (couponDiscountPercent / 100)) : 0;
  const finalTotal = subtotal - discountAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'EARLYBIRD10') {
      setCouponApplied(true);
      setCouponDiscountPercent(10);
    } else if (couponCode.trim().toUpperCase() === 'IIAINDIASAVE') {
      setCouponApplied(true);
      setCouponDiscountPercent(15);
    } else {
      alert('Invalid coupon code. Try "EARLYBIRD10" for 10% off.');
    }
  };

  const handleProceedToPayment = () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert('Please fill in your name, email, and contact number.');
      return;
    }
    setStep(3);
  };

  const handleConfirmPurchase = () => {
    const order: EnrollmentOrder = {
      orderId: `BNC-CIA-${Math.floor(100000 + Math.random() * 900000)}`,
      packageId: currentPkg.id,
      packageName: currentPkg.name,
      currency,
      basePrice,
      discount: discountAmount,
      totalPrice: finalTotal,
      studentName: name,
      studentEmail: email,
      studentPhone: phone,
      qualification,
      paymentMethod: paymentMethod.toUpperCase(),
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      addOns: {
        printedBooks,
        oneOnOneMentoring,
        aiAuditLab,
      },
    };

    setCompletedOrder(order);
    setStep(4);
    if (onEnrollSuccess) {
      onEnrollSuccess(order);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-800">
        {/* Subtle Architectural Accent */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src="/hero-bg.jpg"
            alt="BNC Background"
            className="w-full h-full object-cover object-center opacity-[0.05] filter saturate-[0.8]"
          />
          <div className="absolute inset-0 bg-white/95"></div>
        </div>
        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4 bg-sky-50/50 border-b border-sky-100">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-100 text-[#b58b42]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {step === 4 ? 'Enrollment Confirmed!' : 'BNC Global · Student Enrollment Checkout'}
              </h3>
              <p className="text-xs text-slate-500">
                Official Certified Internal Auditor (CIA®) Training Program
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator */}
        {step !== 4 && (
          <div className="grid grid-cols-3 border-b border-sky-100 text-xs font-semibold">
            <div
              className={`py-2.5 text-center transition-colors ${
                step >= 1 ? 'bg-sky-50 text-sky-900 border-b-2 border-[#b58b42]' : 'text-slate-400'
              }`}
            >
              1. Choose Package
            </div>
            <div
              className={`py-2.5 text-center transition-colors ${
                step >= 2 ? 'bg-sky-50 text-sky-900 border-b-2 border-[#b58b42]' : 'text-slate-400'
              }`}
            >
              2. Student Profile
            </div>
            <div
              className={`py-2.5 text-center transition-colors ${
                step >= 3 ? 'bg-sky-50 text-sky-900 border-b-2 border-[#b58b42]' : 'text-slate-400'
              }`}
            >
              3. Secure Payment
            </div>
          </div>
        )}

        <div className="p-6">
          {/* STEP 1: Package Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Select Training Tier
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2.5">
                  {PACKAGES.map((pkg) => {
                    const isSelected = activePackageId === pkg.id;
                    const price = currency === 'INR' ? `₹${pkg.priceINR.toLocaleString('en-IN')}` : `$${pkg.priceUSD}`;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setActivePackageId(pkg.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-visible ${
                          isSelected
                            ? 'bg-amber-50/60 border-[#b58b42] ring-2 ring-[#b58b42]/20 shadow-sm'
                            : 'bg-white border-sky-100 hover:border-sky-300'
                        }`}
                      >
                        {pkg.badge && (
                          <span className="absolute -top-2.5 right-3 z-20 px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-sky-700 via-sky-800 to-[#b58b42] text-white whitespace-nowrap shadow-xs">
                            {pkg.badge}
                          </span>
                        )}
                        <h4 className="font-bold text-slate-900 text-base mb-1">{pkg.name}</h4>
                        <div className="text-xl font-extrabold text-sky-700 mb-2">{price}</div>
                        <p className="text-xs text-slate-500 line-clamp-2">{pkg.tagline}</p>
                        <div className="mt-3 pt-3 border-t border-sky-100 text-[11px] text-slate-700 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-[#b58b42] shrink-0" />
                            <span>{pkg.deliverables.hours}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-[#b58b42] shrink-0" />
                            <span>{pkg.deliverables.lmsAccess} LMS</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add-ons */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Optional Candidate Add-ons
                </label>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={printedBooks}
                        onChange={(e) => setPrintedBooks(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          Physical Printed Test Bank & Reference Binder
                        </div>
                        <div className="text-xs text-slate-500">
                          {activePackageId === 'basic'
                            ? `Doorstep express courier across India (${currency === 'INR' ? '₹4,500' : '$55'})`
                            : 'Included Free with Premium & Premium Plus cohorts'}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700">
                      {activePackageId === 'basic' ? (currency === 'INR' ? '+₹4,500' : '+$55') : 'INCLUDED'}
                    </span>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={oneOnOneMentoring}
                        onChange={(e) => setOneOnOneMentoring(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          1-on-1 Faculty Mentorship & Mock Interview
                        </div>
                        <div className="text-xs text-slate-500">
                          Personalized resume audit & audit interview preparation with Senior Audit Partner
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-800">
                      {currency === 'INR' ? '+₹8,000' : '+$100'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Order Summary Footnote */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">Estimated Total:</span>
                  <div className="text-2xl font-black text-slate-900">
                    {currency === 'INR' ? `₹${finalTotal.toLocaleString('en-IN')}` : `$${finalTotal}`}
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="btn-reflection inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-700 via-sky-800 to-[#b58b42] hover:from-sky-800 hover:to-[#9e7735] text-white font-bold text-sm shadow-md shadow-sky-800/25 transition-all cursor-pointer"
                >
                  <span>Continue to Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Student Profile */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Legal Name (as per Passport / ID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Rohit Verma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sky-50/40 border border-sky-100 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (for LMS & Portal Access) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rohit.verma@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sky-50/40 border border-sky-100 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sky-50/40 border border-sky-100 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Country of Residence
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., Mumbai, India"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sky-50/40 border border-sky-100 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Highest Educational Qualification
                </label>
                <select
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-sky-50/40 border border-sky-100 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200"
                >
                  <option>Master's Degree (MBA / M.Com / MS / M.Sc)</option>
                  <option>Bachelor's Degree (B.Com / BBA / B.Tech / BA)</option>
                  <option>Enrolled College / University Student (IAP Track)</option>
                  <option>Chartered Accountant (CA - ICAI) / CPA</option>
                  <option>CISA / ACCA / CMA Member</option>
                  <option>Other / Professional</option>
                </select>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-sky-100">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer font-medium"
                >
                  Back to Packages
                </button>
                <button
                  onClick={handleProceedToPayment}
                  className="btn-reflection inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-700 via-sky-800 to-[#b58b42] hover:from-sky-800 hover:to-[#9e7735] text-white font-bold text-sm shadow-md shadow-sky-800/25 hover:shadow-[#b58b42]/30 transition-all cursor-pointer"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Confirmation */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Promo code */}
              <div className="p-3.5 rounded-2xl bg-sky-50/40 border border-sky-100">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon (e.g. EARLYBIRD10)"
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-sky-100 text-slate-900 text-xs uppercase tracking-wider focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
                {couponApplied && (
                  <p className="text-xs text-[#b58b42] mt-1.5 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Coupon applied! You saved {currency === 'INR' ? `₹${discountAmount.toLocaleString('en-IN')}` : `$${discountAmount}`} (10% off).
                  </p>
                )}
              </div>

              {/* Payment Schedule */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Payment Structure
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentPlan('full')}
                    className={`p-3 rounded-2xl border cursor-pointer ${
                      paymentPlan === 'full'
                        ? 'bg-amber-50/60 border-[#b58b42] ring-2 ring-[#b58b42]/20'
                        : 'bg-white border-sky-100'
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-900">Full Upfront Payment</div>
                    <div className="text-xs text-slate-500">Unlock instant LMS credentials</div>
                  </div>
                  <div
                    onClick={() => setPaymentPlan('emi')}
                    className={`p-3 rounded-2xl border cursor-pointer ${
                      paymentPlan === 'emi'
                        ? 'bg-amber-50/60 border-[#b58b42] ring-2 ring-[#b58b42]/20'
                        : 'bg-white border-sky-100'
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-900">2-Part Zero-Cost Installments</div>
                    <div className="text-xs text-slate-500">50% today, 50% after 30 days</div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'bg-amber-50/70 border-amber-500 text-amber-800 font-bold'
                        : 'bg-white border-sky-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[#b58b42]" />
                    <span className="text-xs">UPI / QR Code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-amber-50/70 border-amber-500 text-amber-800 font-bold'
                        : 'bg-white border-sky-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#b58b42]" />
                    <span className="text-xs">Card (Debit/Credit)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'bg-amber-50/70 border-amber-500 text-amber-800 font-bold'
                        : 'bg-white border-sky-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building className="w-5 h-5 text-sky-600" />
                    <span className="text-xs">Net Banking</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wire')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'wire'
                        ? 'bg-amber-50/70 border-amber-500 text-amber-800 font-bold'
                        : 'bg-white border-sky-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Clock className="w-5 h-5 text-sky-600" />
                    <span className="text-xs">NEFT / Wire</span>
                  </button>
                </div>
              </div>

              {/* Order Breakdown Box */}
              <div className="p-4 rounded-2xl bg-sky-50/40 border border-sky-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{currentPkg.name}</span>
                  <span>{currency === 'INR' ? `₹${basePrice.toLocaleString('en-IN')}` : `$${basePrice}`}</span>
                </div>
                {printedBooks && activePackageId === 'basic' && (
                  <div className="flex justify-between text-slate-600">
                    <span>Physical Test Bank Courier</span>
                    <span>{currency === 'INR' ? '₹4,500' : '$55'}</span>
                  </div>
                )}
                {oneOnOneMentoring && (
                  <div className="flex justify-between text-slate-600">
                    <span>1-on-1 Faculty Mentorship</span>
                    <span>{currency === 'INR' ? '₹8,000' : '$100'}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#b58b42] font-bold">
                    <span>Promo Discount ({couponDiscountPercent}%)</span>
                    <span>-{currency === 'INR' ? `₹${discountAmount.toLocaleString('en-IN')}` : `$${discountAmount}`}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-sky-100 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>
                    {paymentPlan === 'emi' ? 'Due Today (50% Installment):' : 'Total Amount Payable:'}
                  </span>
                  <span className="text-sky-700 text-base">
                    {paymentPlan === 'emi'
                      ? currency === 'INR'
                        ? `₹${Math.round(finalTotal / 2).toLocaleString('en-IN')}`
                        : `$${Math.round(finalTotal / 2)}`
                      : currency === 'INR'
                      ? `₹${finalTotal.toLocaleString('en-IN')}`
                      : `$${finalTotal}`}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer font-medium"
                >
                  Back to Profile
                </button>
                <button
                  onClick={handleConfirmPurchase}
                  className="btn-reflection px-8 py-3 rounded-xl bg-gradient-to-r from-sky-700 via-sky-800 to-[#b58b42] hover:from-sky-800 hover:to-[#9e7735] text-white font-extrabold text-sm shadow-md shadow-sky-800/25 hover:shadow-[#b58b42]/35 transition-all cursor-pointer"
                >
                  Pay & Confirm Enrollment
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && completedOrder && (
            <div className="py-6 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  Welcome to BNC Global, {completedOrder.studentName}!
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Your seat in the upcoming CIA® Cohort has been successfully confirmed. Our academic coordinator will contact you on WhatsApp.
                </p>
              </div>

              {/* Receipt */}
              <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2.5">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-mono font-bold text-blue-900">{completedOrder.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Program:</span>
                  <span className="font-semibold text-slate-900">{completedOrder.packageName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="text-slate-800">{completedOrder.studentName} ({completedOrder.studentEmail})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    {completedOrder.currency === 'INR'
                      ? `₹${completedOrder.totalPrice.toLocaleString('en-IN')}`
                      : `$${completedOrder.totalPrice}`}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    alert(`Tax invoice for Order #${completedOrder.orderId} downloaded.`);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Tax Invoice</span>
                </button>
                <button
                  onClick={onClose}
                  className="btn-reflection px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
