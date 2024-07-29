import DeployButton from "../components/DeployButton";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import ConnectSupabaseSteps from "@/components/tutorial/ConnectSupabaseSteps";
import SignUpUserSteps from "@/components/tutorial/SignUpUserSteps";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import ToolCard from "@/components/ToolCard";

export default async function Index() {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <AuthButton />
        </div>
      </nav>
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="container mx-auto px-4">
          <header className="flex justify-between items-center py-8">
            <div>

              <h1 className="text-3xl font-bold mt-2">MBTI人格类型测试专家</h1>
              <p className="text-gray-600 mt-1">这不仅是一个自我发现的过程也是一次自我完善的旅程</p>
              <button className="bg-black text-white px-6 py-2 rounded-full mt-4">现在就试试吧</button>
            </div>

          </header>

          <NavBar />

          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <ToolCard
              title="稳定扩散3+1.5x Upscale V1.1"
              description="稳定扩散3和1.5倍升级版人工智能生成图像中无与伦比的真实感和细节，通过增强的算法和大幅扩展的训练集，它在各种风格和主题中产生..."
              views={931}
              likes={4000}
              comments={59}
            />
            <ToolCard
              title="稳定扩散3+1.5x Upscale V1.1"
              description="稳定扩散3和1.5倍升级版人工智能生成图像中无与伦比的真实感和细节，通过增强的算法和大幅扩展的训练集，它在各种风格和主题中产生..."
              views={931}
              likes={4000}
              comments={59}
            />
            <ToolCard
              title="稳定扩散3+1.5x Upscale V1.1"
              description="稳定扩散3和1.5倍升级版人工智能生成图像中无与伦比的真实感和细节，通过增强的算法和大幅扩展的训练集，它在各种风格和主题中产生..."
              views={931}
              likes={4000}
              comments={59}
            />
            <ToolCard
              title="稳定扩散3+1.5x Upscale V1.1"
              description="稳定扩散3和1.5倍升级版人工智能生成图像中无与伦比的真实感和细节，通过增强的算法和大幅扩展的训练集，它在各种风格和主题中产生..."
              views={931}
              likes={4000}
              comments={59}
            />
            <ToolCard
              title="稳定扩散3+1.5x Upscale V1.1"
              description="稳定扩散3和1.5倍升级版人工智能生成图像中无与伦比的真实感和细节，通过增强的算法和大幅扩展的训练集，它在各种风格和主题中产生..."
              views={931}
              likes={4000}
              comments={59}
            />
            <ToolCard
              title="稳定扩散3+1.5x Upscale V1.1"
              description="稳定扩散3和1.5倍升级版人工智能生成图像中无与伦比的真实感和细节，通过增强的算法和大幅扩展的训练集，它在各种风格和主题中产生..."
              views={931}
              likes={4000}
              comments={59}
            />
            <ToolCard
              title="稳定扩散3+1.5x Upscale V1.1"
              description="稳定扩散3和1.5倍升级版人工智能生成图像中无与伦比的真实感和细节，通过增强的算法和大幅扩展的训练集，它在各种风格和主题中产生..."
              views={931}
              likes={4000}
              comments={59}
            />
            <ToolCard
              title="稳定扩散3+1.5x Upscale V1.1"
              description="稳定扩散3和1.5倍升级版人工智能生成图像中无与伦比的真实感和细节，通过增强的算法和大幅扩展的训练集，它在各种风格和主题中产生..."
              views={931}
              likes={4000}
              comments={59}
            />
            {/* Add more ToolCard components for other tools */}
          </main>
        </div>




      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{" "}
          <a
            href=""
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            找自己
          </a>
        </p>
      </footer>
    </div>
  );
}
