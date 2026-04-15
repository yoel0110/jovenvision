using JovenVision.Application.Common;
using System.Text.Json;

namespace JovenVision.Api.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (NotFoundException ex)
            {
                await WriteResponse(context, StatusCodes.Status404NotFound,
                    ApiResponse<object>.Fail(ex.Message));
            }
            catch (InvalidOperationException ex)
            {
                await WriteResponse(context, StatusCodes.Status409Conflict,
                    ApiResponse<object>.Fail(ex.Message));
            }
            catch (Exception ex)
            {
                await WriteResponse(context, StatusCodes.Status500InternalServerError,
                    ApiResponse<object>.Fail("Error interno del servidor.", new[] { ex.Message }));
            }
        }

        private static Task WriteResponse(HttpContext context, int statusCode, object body)
        {
            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";
            return context.Response.WriteAsync(
                JsonSerializer.Serialize(body, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
        }
    }
}
