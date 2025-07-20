
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ApiDocumentation = () => {
  const { toast } = useToast();
  const apiUrl = "https://bgvxnummhuxnaatbrhfs.supabase.co/functions/v1/get-feedback-data";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Berhasil disalin!",
      description: "URL API telah disalin ke clipboard",
    });
  };

  const examples = [
    {
      title: "Ambil semua data (maksimal 50)",
      url: apiUrl,
      description: "Mengambil 50 data feedback terbaru"
    },
    {
      title: "Ambil data dengan limit tertentu",
      url: `${apiUrl}?limit=10`,
      description: "Mengambil 10 data feedback terbaru"
    },
    {
      title: "Filter berdasarkan jenis feedback",
      url: `${apiUrl}?jenis_feedback=saran`,
      description: "Mengambil hanya feedback dengan jenis 'saran'"
    },
    {
      title: "Filter berdasarkan tanggal",
      url: `${apiUrl}?start_date=2024-01-01&end_date=2024-12-31`,
      description: "Mengambil feedback dalam rentang tanggal tertentu"
    }
  ];

  const javascriptExample = `
// Contoh penggunaan dengan JavaScript
async function getFeedbackData() {
  try {
    const response = await fetch('${apiUrl}?limit=20');
    const result = await response.json();
    
    if (result.success) {
      console.log('Data feedback:', result.data);
      console.log('Statistik:', result.statistics);
      
      // Tampilkan data di website Anda
      result.data.forEach(feedback => {
        console.log(\`\${feedback.nama}: \${feedback.pesan_feedback}\`);
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Panggil fungsi
getFeedbackData();
  `.trim();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            API Endpoint Survei Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
            <code className="text-sm">{apiUrl}</code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(apiUrl)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid gap-4">
            <div>
              <h3 className="font-semibold mb-2">Parameter yang tersedia:</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">limit</Badge>
                  <span className="text-sm">Jumlah data yang diambil (default: 50)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">jenis_feedback</Badge>
                  <span className="text-sm">Filter: saran, keluhan, atau pujian</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">start_date</Badge>
                  <span className="text-sm">Tanggal mulai (format: YYYY-MM-DD)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">end_date</Badge>
                  <span className="text-sm">Tanggal akhir (format: YYYY-MM-DD)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contoh Penggunaan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {examples.map((example, index) => (
            <div key={index} className="border rounded-lg p-3">
              <h4 className="font-medium mb-1">{example.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{example.description}</p>
              <div className="bg-gray-100 p-2 rounded flex items-center justify-between">
                <code className="text-xs break-all">{example.url}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(example.url)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contoh Kode JavaScript</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              <code>{javascriptExample}</code>
            </pre>
          </div>
          <Button
            className="mt-3"
            variant="outline"
            onClick={() => copyToClipboard(javascriptExample)}
          >
            <Copy className="h-4 w-4 mr-2" />
            Salin Kode
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Format Response</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto">
{`{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nama": "Nama Pengguna",
      "judul_utama": "email@example.com",
      "jenis_feedback": "saran",
      "pesan_feedback": "Pesan feedback...",
      "rating_kepuasan": 5,
      "created_at": "2024-01-01T10:00:00Z"
    }
  ],
  "statistics": {
    "total_feedback": 100,
    "average_rating": 4.2,
    "feedback_types": {
      "saran": 40,
      "keluhan": 35,
      "pujian": 25
    },
    "rating_distribution": {
      "1": 5,
      "2": 10,
      "3": 15,
      "4": 30,
      "5": 40
    }
  },
  "total_records": 50,
  "filters_applied": {
    "limit": 50,
    "jenis_feedback": null,
    "start_date": null,
    "end_date": null
  }
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiDocumentation;
