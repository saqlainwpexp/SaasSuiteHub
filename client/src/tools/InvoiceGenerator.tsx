import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Receipt, 
  Plus, 
  Trash2, 
  Calendar, 
  Download, 
  FileText, 
  DollarSign, 
  CreditCard,
  ReceiptText,
  Settings
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export default function InvoiceGenerator() {
  const [activeTab, setActiveTab] = useState("details");
  
  // Invoice details
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("en");
  const [notes, setNotes] = useState("");
  const [taxIncluded, setTaxIncluded] = useState(false);
  
  // Company information
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [companyState, setCompanyState] = useState("");
  const [companyZip, setCompanyZip] = useState("");
  const [companyCountry, setCompanyCountry] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  
  // Client information
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientCity, setClientCity] = useState("");
  const [clientState, setClientState] = useState("");
  const [clientZip, setClientZip] = useState("");
  const [clientCountry, setClientCountry] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  
  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxRate: 0
    }
  ]);
  
  // Payment information
  const [paymentTerms, setPaymentTerms] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankSwift, setBankSwift] = useState("");
  
  // Template settings
  const [template, setTemplate] = useState("modern");
  const [primaryColor, setPrimaryColor] = useState("#00d66f");
  const [logoPosition, setLogoPosition] = useState("left");
  const [showFooter, setShowFooter] = useState(true);
  const [showSignature, setShowSignature] = useState(true);
  
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        taxRate: 0
      }
    ]);
  };
  
  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };
  
  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCompanyLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const subtotal = items.reduce((acc, item) => {
    return acc + (item.quantity * item.unitPrice);
  }, 0);
  
  const taxAmount = taxIncluded
    ? 0
    : items.reduce((acc, item) => {
      return acc + (item.quantity * item.unitPrice * (item.taxRate / 100));
    }, 0);
    
  const total = subtotal + taxAmount;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const generatePDF = () => {
    // In a real implementation, this would generate a PDF
    // using a library like jsPDF or by sending the data to a server
    
    alert("This is a demo. In a real application, this would generate and download a PDF of your invoice.");
  };
  
  const generateInvoiceNumber = () => {
    const prefix = "INV";
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    
    setInvoiceNumber(`${prefix}-${year}${month}-${random}`);
  };
  
  const calculateDueDate = (days: number) => {
    const date = new Date(invoiceDate);
    date.setDate(date.getDate() + days);
    setDueDate(date.toISOString().split('T')[0]);
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Invoice Generator</h2>
        <p className="text-gray-600">
          Create professional invoices for your clients
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="details" className="text-xs md:text-sm">
                Details
              </TabsTrigger>
              <TabsTrigger value="company" className="text-xs md:text-sm">
                Company
              </TabsTrigger>
              <TabsTrigger value="client" className="text-xs md:text-sm">
                Client
              </TabsTrigger>
              <TabsTrigger value="items" className="text-xs md:text-sm">
                Items
              </TabsTrigger>
              <TabsTrigger value="payment" className="text-xs md:text-sm">
                Payment
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-4 border rounded-lg p-4">
              <TabsContent value="details">
                <h3 className="text-lg font-medium mb-4">Invoice Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="invoice-number">Invoice Number</Label>
                    <div className="flex">
                      <Input
                        id="invoice-number"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        placeholder="e.g. INV-2023-001"
                        className="rounded-r-none"
                      />
                      <Button 
                        variant="outline" 
                        className="rounded-l-none border-l-0"
                        onClick={generateInvoiceNumber}
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="invoice-date">Invoice Date</Label>
                    <Input
                      id="invoice-date"
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="due-date" className="flex justify-between">
                      <span>Due Date</span>
                      <span className="text-xs text-gray-500">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-5 text-xs"
                          onClick={() => calculateDueDate(15)}
                        >
                          +15 days
                        </Button>
                        {" / "}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-5 text-xs"
                          onClick={() => calculateDueDate(30)}
                        >
                          +30 days
                        </Button>
                      </span>
                    </Label>
                    <Input
                      id="due-date"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="invoice-language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="invoice-language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes to the client..."
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="tax-included"
                    checked={taxIncluded}
                    onCheckedChange={setTaxIncluded}
                  />
                  <Label htmlFor="tax-included">
                    Prices are tax inclusive
                  </Label>
                </div>
              </TabsContent>
              
              <TabsContent value="company">
                <h3 className="text-lg font-medium mb-4">Company Information</h3>
                
                <div className="mb-6">
                  <Label htmlFor="company-logo" className="block mb-2">Company Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="border rounded-md h-24 w-24 flex items-center justify-center overflow-hidden">
                      {companyLogo ? (
                        <img 
                          src={companyLogo} 
                          alt="Company Logo" 
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <FileText className="h-12 w-12 text-gray-300" />
                      )}
                    </div>
                    <div>
                      <Input
                        id="company-logo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('company-logo')?.click()}
                      >
                        Upload Logo
                      </Button>
                      {companyLogo && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 text-red-500"
                          onClick={() => setCompanyLogo(null)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="company-address">Street Address</Label>
                    <Input
                      id="company-address"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder="123 Business St"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-city">City</Label>
                    <Input
                      id="company-city"
                      value={companyCity}
                      onChange={(e) => setCompanyCity(e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-state">State/Province</Label>
                    <Input
                      id="company-state"
                      value={companyState}
                      onChange={(e) => setCompanyState(e.target.value)}
                      placeholder="State/Province"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-zip">ZIP/Postal Code</Label>
                    <Input
                      id="company-zip"
                      value={companyZip}
                      onChange={(e) => setCompanyZip(e.target.value)}
                      placeholder="ZIP/Postal Code"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-country">Country</Label>
                    <Input
                      id="company-country"
                      value={companyCountry}
                      onChange={(e) => setCompanyCountry(e.target.value)}
                      placeholder="Country"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="company-phone">Phone</Label>
                    <Input
                      id="company-phone"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      placeholder="Phone Number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-email">Email</Label>
                    <Input
                      id="company-email"
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      placeholder="Email Address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-website">Website</Label>
                    <Input
                      id="company-website"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="Website URL"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="client">
                <h3 className="text-lg font-medium mb-4">Client Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="client-name">Client Name</Label>
                    <Input
                      id="client-name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Client Name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="client-address">Street Address</Label>
                    <Input
                      id="client-address"
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      placeholder="123 Client St"
                    />
                  </div>
                  <div>
                    <Label htmlFor="client-city">City</Label>
                    <Input
                      id="client-city"
                      value={clientCity}
                      onChange={(e) => setClientCity(e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="client-state">State/Province</Label>
                    <Input
                      id="client-state"
                      value={clientState}
                      onChange={(e) => setClientState(e.target.value)}
                      placeholder="State/Province"
                    />
                  </div>
                  <div>
                    <Label htmlFor="client-zip">ZIP/Postal Code</Label>
                    <Input
                      id="client-zip"
                      value={clientZip}
                      onChange={(e) => setClientZip(e.target.value)}
                      placeholder="ZIP/Postal Code"
                    />
                  </div>
                  <div>
                    <Label htmlFor="client-country">Country</Label>
                    <Input
                      id="client-country"
                      value={clientCountry}
                      onChange={(e) => setClientCountry(e.target.value)}
                      placeholder="Country"
                    />
                  </div>
                  <div>
                    <Label htmlFor="client-phone">Phone</Label>
                    <Input
                      id="client-phone"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="Phone Number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="client-email">Email</Label>
                    <Input
                      id="client-email"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="Email Address"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="items">
                <h3 className="text-lg font-medium mb-4">Invoice Items</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full mb-4">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Description</th>
                        <th className="text-right p-2 w-20">Quantity</th>
                        <th className="text-right p-2 w-32">Unit Price</th>
                        <th className="text-right p-2 w-24">Tax %</th>
                        <th className="text-right p-2 w-32">Total</th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-b last:border-b-0">
                          <td className="p-2">
                            <Input
                              value={item.description}
                              onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                              placeholder="Item description"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(item.id, "quantity", parseFloat(e.target.value) || 0)}
                              className="text-right"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                              className="text-right"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={item.taxRate}
                              onChange={(e) => handleItemChange(item.id, "taxRate", parseFloat(e.target.value) || 0)}
                              className="text-right"
                            />
                          </td>
                          <td className="p-2 text-right">
                            {formatCurrency(item.quantity * item.unitPrice)}
                          </td>
                          <td className="p-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-red-600"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={items.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <Button
                  variant="outline"
                  className="mb-6"
                  onClick={handleAddItem}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {!taxIncluded && (
                    <div className="flex justify-between mb-2">
                      <span>Tax:</span>
                      <span>{formatCurrency(taxAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="payment">
                <h3 className="text-lg font-medium mb-4">Payment Information</h3>
                
                <div className="mb-4">
                  <Label htmlFor="payment-terms">Payment Terms</Label>
                  <Input
                    id="payment-terms"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    placeholder="e.g. Net 30, Due on Receipt"
                  />
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="payment-method">Accepted Payment Methods</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="card">Credit Card</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      <SelectItem value="multiple">Multiple Methods</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {(paymentMethod === "bank" || paymentMethod === "multiple") && (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-md mb-4">
                    <h4 className="font-medium">Bank Details</h4>
                    <div>
                      <Label htmlFor="bank-name">Bank Name</Label>
                      <Input
                        id="bank-name"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="Bank Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bank-account">Account Number</Label>
                      <Input
                        id="bank-account"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        placeholder="Account Number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bank-swift">SWIFT/BIC Code</Label>
                      <Input
                        id="bank-swift"
                        value={bankSwift}
                        onChange={(e) => setBankSwift(e.target.value)}
                        placeholder="SWIFT/BIC Code"
                      />
                    </div>
                  </div>
                )}
                
                <h3 className="text-lg font-medium mb-4 pt-2">Invoice Template</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="template-style">Template Style</Label>
                    <RadioGroup value={template} onValueChange={setTemplate} className="mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="modern" id="modern" />
                        <Label htmlFor="modern">Modern</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="classic" id="classic" />
                        <Label htmlFor="classic">Classic</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="minimal" id="minimal" />
                        <Label htmlFor="minimal">Minimal</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label htmlFor="primary-color" className="block mb-2">
                      Accent Color
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="logo-position">Logo Position</Label>
                    <Select value={logoPosition} onValueChange={setLogoPosition}>
                      <SelectTrigger id="logo-position">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-footer"
                      checked={showFooter}
                      onCheckedChange={setShowFooter}
                    />
                    <Label htmlFor="show-footer">
                      Show Footer
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-signature"
                      checked={showSignature}
                      onCheckedChange={setShowSignature}
                    />
                    <Label htmlFor="show-signature">
                      Show Signature Line
                    </Label>
                  </div>
                </div>
              </TabsContent>
            </div>
            
            <div className="mt-4 flex justify-between">
              <Button 
                variant="outline"
                onClick={() => {
                  const prevTab = {
                    "details": "details",
                    "company": "details",
                    "client": "company",
                    "items": "client",
                    "payment": "items"
                  }[activeTab] as string;
                  
                  setActiveTab(prevTab);
                }}
                disabled={activeTab === "details"}
              >
                Previous
              </Button>
              <Button 
                onClick={() => {
                  const nextTab = {
                    "details": "company",
                    "company": "client",
                    "client": "items",
                    "items": "payment",
                    "payment": "payment"
                  }[activeTab] as string;
                  
                  if (nextTab === "payment" && activeTab === "items") {
                    setActiveTab(nextTab);
                  } else if (activeTab !== "payment") {
                    setActiveTab(nextTab);
                  }
                }}
                disabled={activeTab === "payment"}
              >
                Next
              </Button>
            </div>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ReceiptText className="h-5 w-5 mr-2" />
                Invoice Preview
              </CardTitle>
              <CardDescription>
                See how your invoice will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md bg-white shadow p-2">
                <div className="bg-gray-100 border p-8 text-center">
                  <Receipt className="h-16 w-16 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">
                    Preview will be generated after filling out required fields
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    (Company name, client, and at least one item)
                  </p>
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <Button 
                  variant="default" 
                  className="w-full" 
                  onClick={generatePDF}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Generate PDF
                </Button>
                <Button variant="outline" className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Customize Template
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-4 bg-gray-50 rounded-lg border p-4">
            <h3 className="font-medium mb-2">Invoice Checklist</h3>
            <ul className="text-sm space-y-1">
              <li className="flex items-center">
                <span className={`h-4 w-4 rounded-full mr-2 ${invoiceNumber ? "bg-green-500" : "bg-gray-300"}`}></span>
                Invoice number
              </li>
              <li className="flex items-center">
                <span className={`h-4 w-4 rounded-full mr-2 ${dueDate ? "bg-green-500" : "bg-gray-300"}`}></span>
                Due date
              </li>
              <li className="flex items-center">
                <span className={`h-4 w-4 rounded-full mr-2 ${companyName ? "bg-green-500" : "bg-gray-300"}`}></span>
                Company information
              </li>
              <li className="flex items-center">
                <span className={`h-4 w-4 rounded-full mr-2 ${clientName ? "bg-green-500" : "bg-gray-300"}`}></span>
                Client information
              </li>
              <li className="flex items-center">
                <span className={`h-4 w-4 rounded-full mr-2 ${items.some(item => item.description && item.unitPrice > 0) ? "bg-green-500" : "bg-gray-300"}`}></span>
                At least one item
              </li>
              <li className="flex items-center">
                <span className={`h-4 w-4 rounded-full mr-2 ${paymentTerms ? "bg-green-500" : "bg-gray-300"}`}></span>
                Payment terms
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-gray-50 rounded-lg border p-4">
        <h3 className="font-medium mb-2">About Invoice Generator</h3>
        <p className="text-sm text-gray-600 mb-4">
          This tool helps you create professional invoices for your clients in just a few minutes.
          Customize your invoice with your company details, logo, and preferred template.
          Download the final invoice as a PDF to share with your clients.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start">
            <DollarSign className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
            <p>Get paid faster with clear, professional invoices that include all necessary details</p>
          </div>
          <div className="flex items-start">
            <CreditCard className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
            <p>Include multiple payment options to make it easier for clients to pay you</p>
          </div>
          <div className="flex items-start">
            <Calendar className="h-5 w-5 mr-2 text-purple-500 flex-shrink-0" />
            <p>Set clear payment terms and due dates to avoid confusion and late payments</p>
          </div>
        </div>
      </div>
    </div>
  );
}