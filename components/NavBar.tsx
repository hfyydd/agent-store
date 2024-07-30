export default function NavBar() {
  const categories = [
    "推荐", "Claude 3.5 Hackathon", "最新", "公开配置", "学习教育", 
    "效率工具", "代码助手", "商业服务", "文本创作", "图像与音视频", "角色", "生活方式", "游戏"
  ];

  return (
    <nav className="overflow-x-auto whitespace-nowrap py-4">
      {categories.map((category, index) => (
        <a key={index} href="#" className="text-sm mr-4 pb-2 border-b-2 border-transparent hover:border-blue-500">
          {category}
        </a>
      ))}
    </nav>
  )
}