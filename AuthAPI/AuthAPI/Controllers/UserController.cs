using AuthAPI.Data;
using AuthAPI.Helpers;
using AuthAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System;

namespace AuthAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UserController(AppDbContext appDbContext)
        {
            _context = appDbContext;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] User userObj)
        {
            if (userObj == null)
            {
                return BadRequest();
            }
            User user = await _context.Users.FirstOrDefaultAsync(x=>x.Username==userObj.Username);
            if (user == null)
            {
                return NotFound(new {Message="User Not Found"});
            }
            if (!PasswordHasher.VerifyPassword(userObj.Password, user.Password))
            {
                return NotFound(new { message = "Incorrect Password" });
            }

            user.Token = CreateJwtToken(user);
            return Ok(new
            {
                Token = user.Token,
                Message="Login Success!"
            });

        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User userObj)
        {
            if (userObj == null)
            {
                return BadRequest();
            }
            //check username
            if (await CheckUsernameExistAsync(userObj.Username))
            {
                return BadRequest(new { Message = "Username is Already Exist" });
            }
            //check email
            if (await CheckEmailExistAsync(userObj.Email))
            {
                return BadRequest(new { Message = "Email is Already Exist" });
            }
            //check password strength
            var pass = CheckPasswordStrength(userObj.Password);
            if (!string.IsNullOrEmpty(pass))
            {
                return BadRequest(new { Message = pass.ToString() });
            }
            userObj.Password=PasswordHasher.HashPassword(userObj.Password);
            userObj.Role = "User";
            userObj.Token = "";
            await _context.Users.AddAsync(userObj);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                Message="User Register Sucessfully!"
            });
        }

        private async Task<bool> CheckUsernameExistAsync(string username)
        {
            return await _context.Users.AnyAsync(x => x.Username == username);
        }

        private async Task<bool> CheckEmailExistAsync(string email)
        {
            return await _context.Users.AnyAsync(x => x.Email == email);
        }

        private string CheckPasswordStrength(string password)
        {
            StringBuilder sb = new StringBuilder();
            if (password.Length < 8)
            {
                sb.Append("Minimum password length should be 8" + Environment.NewLine);
            }
            if (!(Regex.IsMatch(password, "[a-z]") &&
                Regex.IsMatch(password, "[A-Z]")
                && Regex.IsMatch(password, "[0-9]")))
            {
                sb.Append("Password should be Alphanumeric" + Environment.NewLine);
            }
            if (!Regex.IsMatch(password, "[<,>,@,!,#,$,%,^,&,*,(,),_,-,+,\\,{,},?,:,;,|,',.,/,~,`,=]"))
            {
                sb.Append("Password should contain special chars" + Environment.NewLine);
            }
            return sb.ToString();
        }

        [HttpGet("GetAllUser")]
        public async Task<ActionResult<User>> GetAllUsers()
        {
            return Ok(await _context.Users.ToListAsync());
        }
        private string CreateJwtToken(User user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("4D6A7F2E5C8B3A9D1E0F4G7H2J5K8L3M9N1P0Q2R4S6T8U0V1W3X5Y7Z9");
            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Role,user.Role),
                new Claim(ClaimTypes.Name,$"{user.Username}")
            });

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                //three components of token
                Subject = identity,
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials
            };
            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }
    }

}
