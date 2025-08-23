import React, { useState } from 'react';
import { uid } from 'uid';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';
import incrementString from '../helpers/incrementString';
const date = new Date();
const today = date.toLocaleDateString('en-GB', {
  month: 'numeric',
  day: 'numeric',
  year: 'numeric',
});

const InvoiceForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [discount, setDiscount] = useState('');
  const [tax, setTax] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [cashierName, setCashierName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([
    {
      id: uid(6),
      name: '',
      qty: 1,
      price: '1.00',
    },
  ]);

  const reviewInvoiceHandler = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const addNextInvoiceHandler = () => {
    setInvoiceNumber((prevNumber) => incrementString(prevNumber));
    setItems([
      {
        id: uid(6),
        name: '',
        qty: 1,
        price: '1.00',
      },
    ]);
  };

  const addItemHandler = () => {
    const id = uid(6);
    setItems((prevItem) => [
      ...prevItem,
      {
        id: id,
        name: '',
        qty: 1,
        price: '1.00',
      },
    ]);
  };

  const deleteItemHandler = (id) => {
    setItems((prevItem) => prevItem.filter((item) => item.id !== id));
  };

  const edtiItemHandler = (event) => {
    const editedItem = {
      id: event.target.id,
      name: event.target.name,
      value: event.target.value,
    };

    const newItems = items.map((items) => {
      for (const key in items) {
        if (key === editedItem.name && items.id === editedItem.id) {
          items[key] = editedItem.value;
        }
      }
      return items;
    });

    setItems(newItems);
  };

  const subtotal = items.reduce((prev, curr) => {
    if (curr.name.trim().length > 0)
      return prev + Number(curr.price * Math.floor(curr.qty));
    else return prev;
  }, 0);
  const taxRate = (tax * subtotal) / 100;
  const discountRate = (discount * subtotal) / 100;
  const total = subtotal - discountRate + taxRate;

  return (
    <form
      className="relative flex flex-col px-2 md:flex-row bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100"
      onSubmit={reviewInvoiceHandler}
    >
      <div className="my-6 flex-1 space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-colors md:p-6 dark:border-gray-800 dark:bg-gray-900/60 dark:shadow-none">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-200 pb-4 md:flex-row md:items-center dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Current Date:</span>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">{today}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="invoiceNumber">
              Invoice Number:
            </label>
            <input
              required
              className="max-w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm outline-none transition
                        placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
              type="number"
              name="invoiceNumber"
              id="invoiceNumber"
              min="1"
              step="1"
              value={invoiceNumber}
              onChange={(event) => setInvoiceNumber(event.target.value)}
            />
          </div>
        </div>

        <h1 className="text-center text-2xl font-extrabold tracking-wide text-gray-800 dark:text-gray-100">INVOICE</h1>

        <div className="grid grid-cols-2 gap-3 pt-4 pb-8">
          <label htmlFor="cashierName" className="self-center text-sm font-semibold text-gray-700 sm:text-base dark:text-gray-200">
            Cashier:
          </label>
          <input
            required
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition
                      placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
            placeholder="Cashier name"
            type="text"
            name="cashierName"
            id="cashierName"
            value={cashierName}
            onChange={(event) => setCashierName(event.target.value)}
          />

          <label htmlFor="customerName" className="col-start-2 row-start-1 self-center text-sm font-semibold md:text-base dark:text-gray-200">
            Customer:
          </label>
          <input
            required
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition
                      placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
            placeholder="Customer name"
            type="text"
            name="customerName"
            id="customerName"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <tr className="text-xs uppercase tracking-wide md:text-sm">
                <th className="px-3 py-3">Item</th>
                <th className="px-3 py-3">Qty</th>
                <th className="px-3 py-3 text-center">Price</th>
                <th className="px-3 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {items.map((item) => (
                <InvoiceItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  qty={item.qty}
                  price={item.price}
                  onDeleteItem={deleteItemHandler}
                  onEdtiItem={edtiItemHandler}
                />
              ))}
            </tbody>
          </table>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95"
          type="button"
          onClick={addItemHandler}
        >
          Add Item
        </button>

        <div className="flex flex-col items-end space-y-2 pt-6">
          <div className="flex w-full justify-between md:w-1/2">
            <span className="font-semibold text-gray-700 dark:text-gray-200">Subtotal:</span>
            <span className="tabular-nums">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex w-full justify-between md:w-1/2">
            <span className="font-semibold text-gray-700 dark:text-gray-200">Discount:</span>
            <span className="tabular-nums">({discount || '0'}%)₹{discountRate.toFixed(2)}</span>
          </div>
          <div className="flex w-full justify-between md:w-1/2">
            <span className="font-semibold text-gray-700 dark:text-gray-200">Tax:</span>
            <span className="tabular-nums">({tax || '0'}%)₹{taxRate.toFixed(2)}</span>
          </div>
          <div className="mt-1 flex w-full justify-between border-t border-gray-200 pt-3 md:w-1/2 dark:border-gray-800">
            <span className="text-base font-bold text-gray-900 dark:text-gray-100">Total:</span>
            <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
              ₹{total % 1 === 0 ? total : total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="basis-1/4 bg-transparent">
        <div className="sticky top-0 z-10 space-y-4 divide-y divide-gray-200 pb-8 md:pt-6 md:pl-4 dark:divide-gray-800">
          <button
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white shadow-sm transition
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95"
            type="submit"
          >
            Review Invoice
          </button>

          <InvoiceModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            invoiceInfo={{
              invoiceNumber,
              cashierName,
              customerName,
              subtotal,
              taxRate,
              discountRate,
              total,
            }}
            items={items}
            onAddNextInvoice={addNextInvoiceHandler}
          />

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold md:text-base text-gray-700 dark:text-gray-200" htmlFor="tax">
                Tax rate:
              </label>
              <div className="flex items-center">
                <input
                  className="w-full rounded-l-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition
                             placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
                  type="number"
                  name="tax"
                  id="tax"
                  min="0.01"
                  step="0.01"
                  placeholder="0.0"
                  value={tax}
                  onChange={(event) => setTax(event.target.value)}
                />
                <span className="rounded-r-lg border border-l-0 border-gray-300 bg-gray-100 px-4 py-2 text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  %
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold md:text-base text-gray-700 dark:text-gray-200" htmlFor="discount">
                Discount rate:
              </label>
              <div className="flex items-center">
                <input
                  className="w-full rounded-l-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition
                             placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
                  type="number"
                  name="discount"
                  id="discount"
                  min="0"
                  step="0.01"
                  placeholder="0.0"
                  value={discount}
                  onChange={(event) => setDiscount(event.target.value)}
                />
                <span className="rounded-r-lg border border-l-0 border-gray-300 bg-gray-100 px-4 py-2 text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default InvoiceForm;
