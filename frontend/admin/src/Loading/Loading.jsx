const Loading = () => {
  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#222]">
          <div className="flex space-x-2">
              {[
                  { color: 'bg-red-500', delay: 'delay-100' },
                  { color: 'bg-yellow-400', delay: 'delay-200' },
                  { color: 'bg-blue-500', delay: 'delay-300' },
                  { color: 'bg-green-500', delay: 'delay-400' },
              ].map((dot, index) => (
                  <div
                      key={index}
                      className={`w-4 h-4 rounded-full ${dot.color} animate-bounce ${dot.delay}`}
                  ></div>
              ))}
          </div>
      </div>
  );
};

export default Loading;