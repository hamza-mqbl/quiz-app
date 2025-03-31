import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BookOpen, CheckCircle, Brain, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/50">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                  Smarter Learning. Better Results.
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none animate-fade-up">
                    Learn, Test, Excel with <span className="text-primary">QuizMaster</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl lg:text-base xl:text-xl animate-fade-up">
                    The ultimate platform for teachers to create engaging quizzes and for students to test their
                    knowledge.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row animate-fade-up">
                  <Button asChild size="lg" className="rounded-full px-8">
                    <Link href="/signup">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="rounded-full">
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground animate-fade-up">
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-3 w-3 text-primary" />
                    <span>Free to use</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-3 w-3 text-primary" />
                    <span>No credit card</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-3 w-3 text-primary" />
                    <span>Instant access</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="rounded-2xl overflow-hidden shadow-xl transition-all duration-500 bg-white dark:bg-gray-900 animate-fade-left h-[500px] w-full max-w-[500px] relative p-1">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-primary to-violet-500"></div>
                  <div className="p-4">
                    <div className="w-full h-[460px] rounded-xl bg-muted flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                          src="/placeholder.svg?height=450&width=450"
                          alt="Quiz interface preview"
                          width={450}
                          height={450}
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col items-center justify-end p-8">
                        <h3 className="text-white text-xl font-bold mb-2">Interactive Quiz Experience</h3>
                        <p className="text-white/80 text-sm text-center">Engage with beautiful quizzes on any device</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-muted/50 to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Features
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Everything you need for interactive learning
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Powerful tools for teachers and students to create, take, and analyze quizzes
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-6 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-xl border p-8 shadow-sm transition-all hover:shadow-md hover:bg-muted/50">
                <div className="rounded-full bg-primary/10 p-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">For Teachers</h3>
                <p className="text-center text-muted-foreground">
                  Create, manage, and analyze quizzes with our intuitive interface
                </p>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Easy quiz creation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Student performance tracking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Detailed analytics</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-xl border-2 border-primary p-8 shadow-md bg-white dark:bg-slate-900">
                <div className="rounded-full bg-primary/10 p-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">For Students</h3>
                <p className="text-center text-muted-foreground">
                  Take quizzes, track progress, and improve your knowledge
                </p>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Interactive quiz experience</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Immediate feedback</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Progress monitoring</span>
                  </li>
                </ul>
                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                  <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR CHOICE
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-xl border p-8 shadow-sm transition-all hover:shadow-md hover:bg-muted/50">
                <div className="rounded-full bg-primary/10 p-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Analytics</h3>
                <p className="text-center text-muted-foreground">
                  Detailed insights and performance metrics for continuous improvement
                </p>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Visual dashboards</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Actionable insights</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Performance tracking</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                How It Works
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Simple steps to get started
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Begin your learning journey with QuizMaster in just three simple steps
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-6 md:grid-cols-3 relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-muted">
                <div className="absolute left-1/6 top-1/2 w-2/3 h-0.5 bg-primary transform -translate-y-1/2"></div>
              </div>
              <div className="flex flex-col items-center space-y-4 relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground shadow-lg relative z-10">
                  1
                </div>
                <h3 className="text-xl font-bold">Sign Up</h3>
                <p className="text-center text-muted-foreground">
                  Create an account as a teacher or student in seconds
                </p>
                <div className="mt-4">
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href="/signup">Create Account</Link>
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground shadow-lg relative z-10">
                  2
                </div>
                <h3 className="text-xl font-bold">Create or Join</h3>
                <p className="text-center text-muted-foreground">
                  Teachers create quizzes, students join with quiz codes
                </p>
                <div className="mt-4">
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href="/signin">Get Started</Link>
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground shadow-lg relative z-10">
                  3
                </div>
                <h3 className="text-xl font-bold">Learn and Improve</h3>
                <p className="text-center text-muted-foreground">
                  Take quizzes, review results, and track progress over time
                </p>
                <div className="mt-4">
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href="/signin">Start Learning</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of teachers and students already using QuizMaster
                </p>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:flex-row">
                <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
                  <Link href="/signup">
                    Create an Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="rounded-full">
                  <Link href="/signin">Sign In</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl pt-8">
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-3xl font-bold text-primary">5,000+</div>
                  <p className="text-muted-foreground">Active Users</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-3xl font-bold text-primary">10,000+</div>
                  <p className="text-muted-foreground">Quizzes Created</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <p className="text-muted-foreground">Satisfaction Rate</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

