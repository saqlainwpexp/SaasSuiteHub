import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  QrCode, 
  Link, 
  FileText, 
  Wifi, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Download, 
  RefreshCw, 
  CreditCard
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function QRGenerator() {
  const [contentType, setContentType] = useState("url");
  const [urlInput, setUrlInput] = useState("https://example.com");
  const [textInput, setTextInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [vCardFirstName, setVCardFirstName] = useState("");
  const [vCardLastName, setVCardLastName] = useState("");
  const [vCardPhone, setVCardPhone] = useState("");
  const [vCardEmail, setVCardEmail] = useState("");
  const [vCardCompany, setVCardCompany] = useState("");
  const [vCardTitle, setVCardTitle] = useState("");
  const [vCardWebsite, setVCardWebsite] = useState("");
  const [vCardAddress, setVCardAddress] = useState("");
  const [locationLat, setLocationLat] = useState("");
  const [locationLong, setLocationLong] = useState("");
  const [locationName, setLocationName] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [paymentName, setPaymentName] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentCurrency, setPaymentCurrency] = useState("USD");
  const [qrSize, setQrSize] = useState([250]);
  const [qrColor, setQrColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#FFFFFF");
  const [qrFormat, setQrFormat] = useState("png");
  const [qrErrorCorrection, setQrErrorCorrection] = useState("M");
  const [qrContent, setQrContent] = useState("");
  const [qrImageUrl, setQrImageUrl] = useState("");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const generateQrCode = () => {
    // In a real implementation, this would generate a QR code
    // using a library like qrcode.js
    
    let content = "";
    
    switch (contentType) {
      case "url":
        content = urlInput;
        break;
      case "text":
        content = textInput;
        break;
      case "phone":
        content = `tel:${phoneInput}`;
        break;
      case "email":
        content = `mailto:${emailInput}${emailSubject ? `?subject=${encodeURIComponent(emailSubject)}` : ''}${emailBody ? `${emailSubject ? '&' : '?'}body=${encodeURIComponent(emailBody)}` : ''}`;
        break;
      case "wifi":
        content = `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};;`;
        break;
      case "vcard":
        content = `BEGIN:VCARD
VERSION:3.0
N:${vCardLastName};${vCardFirstName}
FN:${vCardFirstName} ${vCardLastName}
ORG:${vCardCompany}
TITLE:${vCardTitle}
TEL:${vCardPhone}
EMAIL:${vCardEmail}
URL:${vCardWebsite}
ADR:;;${vCardAddress}
END:VCARD`;
        break;
      case "location":
        content = `geo:${locationLat},${locationLong}?q=${encodeURIComponent(locationName || `${locationLat},${locationLong}`)}`;
        break;
      case "event":
        // Format dates for iCalendar (YYYYMMDDTHHMMSSZ)
        const formatDate = (dateString: string) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        const startDate = formatDate(eventStart);
        const endDate = formatDate(eventEnd);
        
        content = `BEGIN:VEVENT
SUMMARY:${eventTitle}
LOCATION:${eventLocation}
DESCRIPTION:${eventDescription}
DTSTART:${startDate}
DTEND:${endDate}
END:VEVENT`;
        break;
      case "payment":
        content = `bitcoin:?label=${encodeURIComponent(paymentName)}&amount=${paymentAmount}`;
        break;
      default:
        content = urlInput;
    }
    
    setQrContent(content);
    
    // For demo purposes, we'll just use a placeholder QR code image
    setQrImageUrl(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(content)}&size=${qrSize[0]}x${qrSize[0]}&color=${qrColor.substring(1)}&bgcolor=${qrBgColor.substring(1)}&ecc=${qrErrorCorrection}`);
    
    // In a real implementation, we would generate the QR code on the client side
    // and draw it on the canvas
  };
  
  const downloadQrCode = () => {
    if (!qrImageUrl) return;
    
    // Create a temporary link element
    const a = document.createElement('a');
    a.href = qrImageUrl;
    a.download = `qrcode.${qrFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">QR Code Generator</h2>
        <p className="text-gray-600">
          Create custom QR codes for various purposes
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>QR Code Content</CardTitle>
              <CardDescription>
                Select the type of content for your QR code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={contentType} onValueChange={setContentType}>
                <TabsList className="grid grid-cols-4 md:grid-cols-4 mb-4">
                  <TabsTrigger value="url" className="flex flex-col items-center gap-1 py-2">
                    <Link className="h-5 w-5" />
                    <span className="text-xs">URL</span>
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex flex-col items-center gap-1 py-2">
                    <FileText className="h-5 w-5" />
                    <span className="text-xs">Text</span>
                  </TabsTrigger>
                  <TabsTrigger value="wifi" className="flex flex-col items-center gap-1 py-2">
                    <Wifi className="h-5 w-5" />
                    <span className="text-xs">WiFi</span>
                  </TabsTrigger>
                  <TabsTrigger value="vcard" className="flex flex-col items-center gap-1 py-2">
                    <CreditCard className="h-5 w-5" />
                    <span className="text-xs">vCard</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsList className="grid grid-cols-5 md:grid-cols-5 mb-4">
                  <TabsTrigger value="phone" className="flex flex-col items-center gap-1 py-2">
                    <Phone className="h-5 w-5" />
                    <span className="text-xs">Phone</span>
                  </TabsTrigger>
                  <TabsTrigger value="email" className="flex flex-col items-center gap-1 py-2">
                    <Mail className="h-5 w-5" />
                    <span className="text-xs">Email</span>
                  </TabsTrigger>
                  <TabsTrigger value="location" className="flex flex-col items-center gap-1 py-2">
                    <MapPin className="h-5 w-5" />
                    <span className="text-xs">Location</span>
                  </TabsTrigger>
                  <TabsTrigger value="event" className="flex flex-col items-center gap-1 py-2">
                    <Calendar className="h-5 w-5" />
                    <span className="text-xs">Event</span>
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="flex flex-col items-center gap-1 py-2">
                    <CreditCard className="h-5 w-5" />
                    <span className="text-xs">Payment</span>
                  </TabsTrigger>
                </TabsList>
                
                <div className="p-4 border rounded-md">
                  <TabsContent value="url">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="url-input">Website URL</Label>
                        <Input
                          id="url-input"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="text">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="text-input">Text Content</Label>
                        <Textarea
                          id="text-input"
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          placeholder="Enter text to encode in the QR code"
                          rows={4}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="phone">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="phone-input">Phone Number</Label>
                        <Input
                          id="phone-input"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="+1234567890"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="email">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email-input">Email Address</Label>
                        <Input
                          id="email-input"
                          type="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="example@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email-subject">Subject (optional)</Label>
                        <Input
                          id="email-subject"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          placeholder="Email subject"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email-body">Body (optional)</Label>
                        <Textarea
                          id="email-body"
                          value={emailBody}
                          onChange={(e) => setEmailBody(e.target.value)}
                          placeholder="Email body"
                          rows={3}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="wifi">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
                        <Input
                          id="wifi-ssid"
                          value={wifiSsid}
                          onChange={(e) => setWifiSsid(e.target.value)}
                          placeholder="WiFi Network Name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="wifi-password">Password</Label>
                        <Input
                          id="wifi-password"
                          type="password"
                          value={wifiPassword}
                          onChange={(e) => setWifiPassword(e.target.value)}
                          placeholder="WiFi Password"
                        />
                      </div>
                      <div>
                        <Label htmlFor="wifi-encryption">Encryption Type</Label>
                        <Select value={wifiEncryption} onValueChange={setWifiEncryption}>
                          <SelectTrigger id="wifi-encryption">
                            <SelectValue placeholder="Select encryption type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WPA">WPA/WPA2/WPA3</SelectItem>
                            <SelectItem value="WEP">WEP</SelectItem>
                            <SelectItem value="nopass">No Password</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="vcard">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vcard-firstname">First Name</Label>
                        <Input
                          id="vcard-firstname"
                          value={vCardFirstName}
                          onChange={(e) => setVCardFirstName(e.target.value)}
                          placeholder="First Name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vcard-lastname">Last Name</Label>
                        <Input
                          id="vcard-lastname"
                          value={vCardLastName}
                          onChange={(e) => setVCardLastName(e.target.value)}
                          placeholder="Last Name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vcard-phone">Phone</Label>
                        <Input
                          id="vcard-phone"
                          value={vCardPhone}
                          onChange={(e) => setVCardPhone(e.target.value)}
                          placeholder="Phone Number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vcard-email">Email</Label>
                        <Input
                          id="vcard-email"
                          value={vCardEmail}
                          onChange={(e) => setVCardEmail(e.target.value)}
                          placeholder="Email Address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vcard-company">Company</Label>
                        <Input
                          id="vcard-company"
                          value={vCardCompany}
                          onChange={(e) => setVCardCompany(e.target.value)}
                          placeholder="Company"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vcard-title">Job Title</Label>
                        <Input
                          id="vcard-title"
                          value={vCardTitle}
                          onChange={(e) => setVCardTitle(e.target.value)}
                          placeholder="Job Title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vcard-website">Website</Label>
                        <Input
                          id="vcard-website"
                          value={vCardWebsite}
                          onChange={(e) => setVCardWebsite(e.target.value)}
                          placeholder="Website"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="vcard-address">Address</Label>
                        <Input
                          id="vcard-address"
                          value={vCardAddress}
                          onChange={(e) => setVCardAddress(e.target.value)}
                          placeholder="Address"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="location">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="location-lat">Latitude</Label>
                          <Input
                            id="location-lat"
                            value={locationLat}
                            onChange={(e) => setLocationLat(e.target.value)}
                            placeholder="e.g. 37.7749"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location-long">Longitude</Label>
                          <Input
                            id="location-long"
                            value={locationLong}
                            onChange={(e) => setLocationLong(e.target.value)}
                            placeholder="e.g. -122.4194"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="location-name">Location Name (optional)</Label>
                        <Input
                          id="location-name"
                          value={locationName}
                          onChange={(e) => setLocationName(e.target.value)}
                          placeholder="e.g. Golden Gate Park"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="event">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="event-title">Event Title</Label>
                        <Input
                          id="event-title"
                          value={eventTitle}
                          onChange={(e) => setEventTitle(e.target.value)}
                          placeholder="Event Title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="event-location">Location</Label>
                        <Input
                          id="event-location"
                          value={eventLocation}
                          onChange={(e) => setEventLocation(e.target.value)}
                          placeholder="Event Location"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="event-start">Start Date & Time</Label>
                          <Input
                            id="event-start"
                            type="datetime-local"
                            value={eventStart}
                            onChange={(e) => setEventStart(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="event-end">End Date & Time</Label>
                          <Input
                            id="event-end"
                            type="datetime-local"
                            value={eventEnd}
                            onChange={(e) => setEventEnd(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="event-description">Description</Label>
                        <Textarea
                          id="event-description"
                          value={eventDescription}
                          onChange={(e) => setEventDescription(e.target.value)}
                          placeholder="Event Description"
                          rows={3}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="payment">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="payment-name">Name / Description</Label>
                        <Input
                          id="payment-name"
                          value={paymentName}
                          onChange={(e) => setPaymentName(e.target.value)}
                          placeholder="Payment Description"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="payment-amount">Amount</Label>
                          <Input
                            id="payment-amount"
                            type="number"
                            step="0.01"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label htmlFor="payment-currency">Currency</Label>
                          <Select value={paymentCurrency} onValueChange={setPaymentCurrency}>
                            <SelectTrigger id="payment-currency">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="BTC">BTC</SelectItem>
                              <SelectItem value="ETH">ETH</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button onClick={generateQrCode}>
                <QrCode className="mr-2 h-4 w-4" />
                Generate QR Code
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>QR Code Style</CardTitle>
              <CardDescription>
                Customize the appearance of your QR code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="qr-size" className="mb-2 block">
                      Size: {qrSize[0]}x{qrSize[0]} px
                    </Label>
                    <Slider
                      id="qr-size"
                      value={qrSize}
                      onValueChange={setQrSize}
                      min={100}
                      max={500}
                      step={10}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="qr-color" className="mb-2 block">
                      Foreground Color
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="qr-color"
                        type="color"
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="qr-bgcolor" className="mb-2 block">
                      Background Color
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="qr-bgcolor"
                        type="color"
                        value={qrBgColor}
                        onChange={(e) => setQrBgColor(e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={qrBgColor}
                        onChange={(e) => setQrBgColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="qr-format" className="mb-2 block">
                      Download Format
                    </Label>
                    <RadioGroup
                      id="qr-format"
                      value={qrFormat}
                      onValueChange={setQrFormat}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="png" id="png" />
                        <Label htmlFor="png">PNG</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="svg" id="svg" />
                        <Label htmlFor="svg">SVG</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="jpeg" id="jpeg" />
                        <Label htmlFor="jpeg">JPEG</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label htmlFor="qr-error-correction" className="mb-2 block">
                      Error Correction Level
                    </Label>
                    <Select value={qrErrorCorrection} onValueChange={setQrErrorCorrection}>
                      <SelectTrigger id="qr-error-correction">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Low (7%)</SelectItem>
                        <SelectItem value="M">Medium (15%)</SelectItem>
                        <SelectItem value="Q">Quartile (25%)</SelectItem>
                        <SelectItem value="H">High (30%)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Higher levels make QR codes more resistant to damage but increase complexity.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>QR Code Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {qrImageUrl ? (
                <div className="mb-4 p-4 border rounded-md bg-white flex justify-center">
                  <img
                    src={qrImageUrl}
                    alt="Generated QR Code"
                    className="max-w-full"
                  />
                </div>
              ) : (
                <div className="mb-4 p-4 border rounded-md bg-white flex justify-center items-center h-64 w-64">
                  <QrCode className="h-24 w-24 text-gray-300" />
                </div>
              )}
              
              <div className="space-y-3 w-full">
                {qrImageUrl && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={downloadQrCode}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download QR Code
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={generateQrCode}
                  disabled={!qrContent}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh QR Code
                </Button>
              </div>
              
              {qrContent && (
                <div className="mt-4 w-full">
                  <Label htmlFor="qr-content-preview" className="text-xs text-gray-500">
                    Content encoded in QR
                  </Label>
                  <Textarea
                    id="qr-content-preview"
                    value={qrContent}
                    readOnly
                    rows={4}
                    className="text-xs font-mono"
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-4 bg-gray-50 rounded-lg border p-4">
            <h3 className="font-medium mb-2">About QR Codes</h3>
            <p className="text-sm text-gray-600">
              QR codes can store various types of data and are quickly scannable by most smartphone cameras.
              They're useful for sharing links, contact information, WiFi credentials, and more.
              The QR codes generated here are high-quality and customizable.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-gray-50 rounded-lg border p-4">
        <h3 className="font-medium mb-2">QR Code Usage Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p>• Test your QR codes before printing or sharing them</p>
            <p>• Avoid using dark backgrounds behind QR codes</p>
            <p>• Include a clear call-to-action near your QR code</p>
            <p>• Higher error correction allows for more design customization</p>
          </div>
          <div>
            <p>• Keep important data like URLs short for easier scanning</p>
            <p>• Use at least 1-inch size when printing QR codes</p>
            <p>• Provide value to users who scan your QR code</p>
            <p>• Check scanning results on different devices</p>
          </div>
        </div>
      </div>
    </div>
  );
}