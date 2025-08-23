import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const InvoiceModal = ({
  isOpen,
  setIsOpen,
  invoiceInfo,
  items,
  onAddNextInvoice,
}) => {
  function closeModal() {
    setIsOpen(false);
  }

  const addNextInvoiceHandler = () => {
    setIsOpen(false);
    onAddNextInvoice();
  };

  const SaveAsPDFHandler = () => {
    const dom = document.getElementById('print');
    toPng(dom)
      .then((dataUrl) => {
        const img = new Image();
        img.crossOrigin = 'annoymous';
        img.src = dataUrl;
        img.onload = () => {
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: [5.5, 8.5],
          });

          const imgProps = pdf.getImageProperties(img);
          const imageType = imgProps.fileType;
          const pdfWidth = pdf.internal.pageSize.getWidth();

          const pxFullHeight = imgProps.height;
          const pxPageHeight = Math.floor((imgProps.width * 8.5) / 5.5);
          const nPages = Math.ceil(pxFullHeight / pxPageHeight);

          let pageHeight = pdf.internal.pageSize.getHeight();

          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d');
          pageCanvas.width = imgProps.width;
          pageCanvas.height = pxPageHeight;

          for (let page = 0; page < nPages; page++) {
            if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
              pageCanvas.height = pxFullHeight % pxPageHeight;
              pageHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;
            }
            const w = pageCanvas.width;
            const h = pageCanvas.height;
            pageCtx.fillStyle = 'white';
            pageCtx.fillRect(0, 0, w, h);
            pageCtx.drawImage(img, 0, page * pxPageHeight, w, h, 0, 0, w, h);

            if (page) pdf.addPage();

            const imgData = pageCanvas.toDataURL(`image/${imageType}`, 1);
            pdf.addImage(imgData, imageType, 0, 0, pdfWidth, pageHeight);
          }
          pdf.save(`invoice-${invoiceInfo.invoiceNumber}.pdf`);
        };
      })
      .catch((error) => {
        console.error('oops, something went wrong!', error);
      });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60" />
          </Transition.Child>

          {/* Centering hack */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl border border-gray-200 bg-white text-left align-middle shadow-xl transition-all dark:border-gray-800 dark:bg-gray-900">
              <div className="p-5" id="print">
                <h1 className="text-center text-xl font-extrabold tracking-wide text-gray-900 dark:text-gray-100">
                  INVOICE
                </h1>

                <div className="mt-6">
                  <div className="mb-4 grid grid-cols-2 gap-y-2 text-sm">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Invoice Number:</span>
                    <span className="text-gray-800 dark:text-gray-100">{invoiceInfo.invoiceNumber}</span>

                    <span className="font-semibold text-gray-700 dark:text-gray-200">Cashier:</span>
                    <span className="text-gray-800 dark:text-gray-100">{invoiceInfo.cashierName}</span>

                    <span className="font-semibold text-gray-700 dark:text-gray-200">Customer:</span>
                    <span className="text-gray-800 dark:text-gray-100">{invoiceInfo.customerName}</span>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                    <table className="w-full text-left">
                      <thead className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                        <tr className="text-xs uppercase tracking-wide md:text-sm">
                          <th className="px-3 py-3">Item</th>
                          <th className="px-3 py-3 text-center">Qty</th>
                          <th className="px-3 py-3 text-right">Price</th>
                          <th className="px-3 py-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {items.map((item) => (
                          <tr key={item.id} className="bg-white transition-colors hover:bg-gray-50 dark:bg-transparent dark:hover:bg-gray-800/60">
                            <td className="w-full px-3 py-3 text-gray-800 dark:text-gray-100">{item.name}</td>
                            <td className="min-w-[50px] px-3 py-3 text-center tabular-nums text-gray-800 dark:text-gray-100">
                              {item.qty}
                            </td>
                            <td className="min-w-[80px] px-3 py-3 text-right tabular-nums text-gray-800 dark:text-gray-100">
                              ₹{Number(item.price).toFixed(2)}
                            </td>
                            <td className="min-w-[90px] px-3 py-3 text-right tabular-nums text-gray-800 dark:text-gray-100">
                              ₹{Number(item.price * item.qty).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex flex-col items-end space-y-2">
                    <div className="flex w-full justify-between border-t border-gray-200 pt-3 dark:border-gray-800">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Subtotal:</span>
                      <span className="tabular-nums text-gray-900 dark:text-gray-100">₹{invoiceInfo.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex w-full justify-between">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Discount:</span>
                      <span className="tabular-nums text-gray-900 dark:text-gray-100">₹{invoiceInfo.discountRate.toFixed(2)}</span>
                    </div>
                    <div className="flex w-full justify-between">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Tax:</span>
                      <span className="tabular-nums text-gray-900 dark:text-gray-100">₹{invoiceInfo.taxRate.toFixed(2)}</span>
                    </div>
                    <div className="flex w-full justify-between border-t border-gray-200 py-3 dark:border-gray-800">
                      <span className="text-base font-bold text-gray-900 dark:text-gray-100">Total:</span>
                      <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                        ₹{invoiceInfo.total % 1 === 0 ? invoiceInfo.total : invoiceInfo.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2 px-5 pb-6">
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-500 py-2 text-sm font-medium text-blue-600 shadow-sm transition
                             hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 dark:text-blue-400 dark:hover:text-white"
                  onClick={SaveAsPDFHandler}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Download</span>
                </button>

                <button
                  onClick={addNextInvoiceHandler}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white shadow-sm transition
                             hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                  <span>Next</span>
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default InvoiceModal;
