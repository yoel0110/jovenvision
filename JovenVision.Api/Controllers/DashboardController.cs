using JovenVision.Application.Common;
using JovenVision.Application.DTOs.Dashboard;
using JovenVision.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JovenVision.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("engagement")]
        public async Task<IActionResult> GetEngagementMetrics(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string? segments = null,
            [FromQuery] string? metrics = null)
        {
            try
            {
                var result = await _dashboardService.GetEngagementMetricsAsync(startDate, endDate);
                return Ok(ApiResponse<EngagementMetricsDto>.Ok(result, "Métricas de engagement obtenidas correctamente."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<EngagementMetricsDto>.Fail($"Error al obtener métricas: {ex.Message}"));
            }
        }

        [HttpGet("timeseries/{metricType}")]
        public async Task<IActionResult> GetTimeSeriesData(
            string metricType,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string? segments = null,
            [FromQuery] string? metrics = null)
        {
            try
            {
                var result = await _dashboardService.GetTimeSeriesDataAsync(metricType, startDate, endDate);
                return Ok(ApiResponse<List<TimeSeriesDataDto>>.Ok(result, "Datos de series temporales obtenidos correctamente."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<List<TimeSeriesDataDto>>.Fail($"Error al obtener datos de series temporales: {ex.Message}"));
            }
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetMetricsOverview(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string? segments = null,
            [FromQuery] string? metrics = null)
        {
            try
            {
                var result = await _dashboardService.GetMetricsOverviewAsync(startDate, endDate);
                return Ok(ApiResponse<DashboardOverviewDto>.Ok(result, "Vista general de métricas obtenida correctamente."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<DashboardOverviewDto>.Fail($"Error al obtener vista general: {ex.Message}"));
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshMetrics()
        {
            try
            {
                var result = await _dashboardService.RefreshMetricsAsync();
                return Ok(ApiResponse<RefreshResponseDto>.Ok(result, "Métricas refrescadas correctamente."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<RefreshResponseDto>.Fail($"Error al refrescar métricas: {ex.Message}"));
            }
        }
    }
}
