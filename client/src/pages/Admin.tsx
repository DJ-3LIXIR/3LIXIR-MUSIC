import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";
import { Navbar } from "@/components/layout/Navbar";
import { Upload, Check, X } from "lucide-react";

interface Product {
  id: string;
  title: string;
  artist: string;
  download_path: string | null;
}

export default function Admin() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id, title, artist, download_path")
      .order("title");

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data || []);
    }
  };

  const handleFileUpload = async (productId: string, file: File) => {
    try {
      setUploading(productId);

      // Upload to Supabase Storage
      const filePath = `${productId}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("beat-downloads")
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Update product with download path
      const { error: updateError } = await supabase
        .from("products")
        .update({ download_path: filePath })
        .eq("id", productId);

      if (updateError) throw updateError;

      alert("File uploaded successfully!");
      fetchProducts();
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to access admin panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-6 py-20">
        <h1 className="text-5xl font-display font-bold mb-8">Beat Downloads Admin</h1>
        
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-border rounded-lg p-6 flex items-center justify-between"
            >
              <div>
                <h3 className="text-xl font-bold">{product.title}</h3>
                <p className="text-muted-foreground">{product.artist}</p>
                <div className="mt-2 flex items-center gap-2">
                  {product.download_path ? (
                    <span className="text-green-500 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      File uploaded
                    </span>
                  ) : (
                    <span className="text-yellow-500 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      No file
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor={`upload-${product.id}`}
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--gold))] text-black rounded-lg hover:bg-[hsl(var(--gold))]/90 transition-colors"
                >
                  {uploading === product.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload ZIP
                    </>
                  )}
                </label>
                <input
                  id={`upload-${product.id}`}
                  type="file"
                  accept=".zip"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(product.id, file);
                  }}
                  disabled={uploading !== null}
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
