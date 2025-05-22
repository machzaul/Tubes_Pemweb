
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is being edited
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Show success message
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us! We'll get back to you soon.",
      });
    }, 1500);
  };
  
  return (
    <div className="page-container">
      <h1 className="section-title">Contact Us</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium">Email</h3>
                  <p className="text-gray-600">info@machzaulmart.com</p>
                  <p className="text-gray-600">support@machzaulmart.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium">Phone</h3>
                  <p className="text-gray-600">+1 (123) 456-7890</p>
                  <p className="text-gray-600">+1 (987) 654-3210</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium">Address</h3>
                  <p className="text-gray-600">
                    123 Market Street<br />
                    Suite 456<br />
                    City, State 12345<br />
                    United States
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium">Business Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={validationErrors.name ? 'border-red-500' : ''}
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={validationErrors.email ? 'border-red-500' : ''}
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={validationErrors.subject ? 'border-red-500' : ''}
                />
                {validationErrors.subject && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.subject}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`resize-none min-h-[150px] ${validationErrors.message ? 'border-red-500' : ''}`}
                />
                {validationErrors.message && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.message}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="aspect-w-16 aspect-h-9 h-[400px] w-full">
          <iframe
            title="MachzaulMart Location"
            className="w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059353029!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1622132753894!5m2!1sen!2s"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
