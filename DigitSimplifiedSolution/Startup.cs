using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(DigitSimplifiedSolution.Startup))]
namespace DigitSimplifiedSolution
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
