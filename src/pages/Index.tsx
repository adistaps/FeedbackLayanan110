
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { StarRating } from "@/components/ui/star-rating";
import { supabase } from "@/integrations/supabase/client";
import { Send, MessageSquare } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    jenis_feedback: "",
    subjek: "",
    pesan_feedback: "",
    rating_kepuasan: 0
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi field wajib
    if (!formData.nama || !formData.jenis_feedback || !formData.subjek || !formData.pesan_feedback || formData.rating_kepuasan === 0) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let photo_url = null;

      // Upload foto jika ada
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('feedback-photos')
          .upload(fileName, selectedFile);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: "Gagal upload foto",
            description: `Error: ${uploadError.message}`,
            variant: "destructive"
          });
          return;
        }

        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('feedback-photos')
          .getPublicUrl(fileName);
        
        photo_url = publicUrl;
      }

      // Insert data ke Supabase dengan struktur yang benar sesuai tabel feedback
      const { error } = await supabase
        .from('feedback')
        .insert([{
          nama: formData.nama,
          email: formData.email || null,
          feedback_type: formData.jenis_feedback,
          subject: formData.subjek,
          message: formData.pesan_feedback,
          rating: formData.rating_kepuasan,
          photo_url: photo_url,
          status: 'menunggu'
        }]);

      if (error) {
        throw error;
      }

      toast({
        title: "Terima kasih!",
        description: "Feedback Anda telah berhasil dikirim ke database",
      });

      // Reset form
      setFormData({
        nama: "",
        email: "",
        jenis_feedback: "",
        subjek: "",
        pesan_feedback: "",
        rating_kepuasan: 0
      });
      setSelectedFile(null);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal mengirim feedback. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File terlalu besar",
          description: "Ukuran file maksimal 5MB",
          variant: "destructive"
        });
        return;
      }
      
      // Validasi file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Format file tidak didukung",
          description: "Gunakan format JPG atau PNG",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat py-4 px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/lovable-uploads/37af6af0-4abb-4829-b234-c685fdeeb9bc.png')`
      }}
    >
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6">
          {/* Logo dan Text dalam satu container */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30 mb-4">
            <div className="flex items-center justify-center gap-4">
              {/* Logo D.I. Yogyakarta */}
              <div className="flex-shrink-0">
                <img 
                  src="/lovable-uploads/c9db27d7-297c-46ff-ad0c-14b96647248a.png" 
                  alt="Logo D.I. Yogyakarta" 
                  className="h-16 w-16 object-contain"
                />
              </div>
              
              {/* Police Department Text */}
              <div className="text-center">
                <h1 className="text-white text-base font-bold leading-tight">
                  KEPOLISIAN DAERAH<br />
                  ISTIMEWA YOGYAKARTA
                </h1>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="bg-red-900/80 backdrop-blur-sm rounded-lg p-3 border border-white/30">
            <h2 className="text-white text-base font-semibold text-center">
              SURVEI KEPUASAN MASYARAKAT
            </h2>
            <p className="text-white/90 text-sm text-center mt-1">
              Layanan 110
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-white text-lg flex items-center justify-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Kirim Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Nama dan Jenis Feedback */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nama */}
                <div className="space-y-2">
                  <Label htmlFor="nama" className="text-white text-sm font-medium">
                    Nama *
                  </Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => handleInputChange("nama", e.target.value)}
                    placeholder="Nama lengkap Anda"
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 h-10"
                  />
                </div>

                {/* Jenis Feedback */}
                <div className="space-y-2">
                  <Label htmlFor="jenis_feedback" className="text-white text-sm font-medium">
                    Jenis Feedback *
                  </Label>
                  <Select value={formData.jenis_feedback} onValueChange={(value) => handleInputChange("jenis_feedback", value)}>
                    <SelectTrigger className="bg-white/20 backdrop-blur-sm border-white/30 text-white h-10">
                      <SelectValue placeholder="Pilih jenis feedback" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="saran">Saran</SelectItem>
                      <SelectItem value="keluhan">Keluhan</SelectItem>
                      <SelectItem value="pujian">Pujian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Email Anda (opsional)"
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 h-10"
                />
              </div>

              {/* Subjek */}
              <div className="space-y-2">
                <Label htmlFor="subjek" className="text-white text-sm font-medium">
                  Subjek *
                </Label>
                <Input
                  id="subjek"
                  value={formData.subjek}
                  onChange={(e) => handleInputChange("subjek", e.target.value)}
                  placeholder="Masukkan subjek feedback"
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 h-10"
                />
              </div>

              {/* Pesan Feedback */}
              <div className="space-y-2">
                <Label htmlFor="pesan_feedback" className="text-white text-sm font-medium">
                  Pesan *
                </Label>
                <Textarea
                  id="pesan_feedback"
                  value={formData.pesan_feedback}
                  onChange={(e) => handleInputChange("pesan_feedback", e.target.value)}
                  placeholder="Tuliskan feedback Anda di sini..."
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 min-h-[80px] resize-none"
                />
              </div>

              {/* Rating Kepuasan */}
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium">
                  Rating Kepuasan *
                </Label>
                <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                  <div className="flex justify-center mb-2">
                    <StarRating 
                      value={formData.rating_kepuasan} 
                      onChange={(value) => handleInputChange("rating_kepuasan", value)}
                    />
                  </div>
                  <p className="text-white/80 text-xs text-center">
                    {formData.rating_kepuasan === 0 ? "Berikan rating dari 1-5 bintang (Rating saat ini: 0/5)" : 
                     formData.rating_kepuasan === 1 ? "Sangat Tidak Puas" :
                     formData.rating_kepuasan === 2 ? "Tidak Puas" :
                     formData.rating_kepuasan === 3 ? "Cukup Puas" :
                     formData.rating_kepuasan === 4 ? "Puas" : "Sangat Puas"}
                  </p>
                </div>
              </div>

              {/* Upload Foto */}
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium">
                  Upload Foto (Opsional)
                </Label>
                <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFileChange}
                    className="w-full text-white/80 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-white/20 file:text-white hover:file:bg-white/30"
                  />
                  <p className="text-white/60 text-xs mt-2">
                    Format: JPG, PNG, maksimal 5MB
                  </p>
                  {selectedFile && (
                    <p className="text-white/80 text-xs mt-1">
                      File terpilih: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-red-800 hover:bg-red-900 text-white h-10 font-medium shadow-lg disabled:opacity-50" 
              >
                {isSubmitting ? (
                  "Mengirim..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Kirim Feedback
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <p className="text-white/80 text-xs">* Field wajib diisi</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
