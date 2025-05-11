import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-20" />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2 w-full text-center">
                      <Skeleton className="h-6 w-32 mx-auto" />
                      <Skeleton className="h-4 w-48 mx-auto" />
                    </div>
                    <div className="w-full">
                      <Skeleton className="h-px w-full my-4" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-px w-full my-4" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:w-2/3">
              <Skeleton className="h-10 w-full mb-4" />

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </CardContent>
                <div className="p-6 flex justify-between">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
