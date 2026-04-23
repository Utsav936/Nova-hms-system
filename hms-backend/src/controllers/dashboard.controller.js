const catchAsync = require('../utils/catchAsync');
const dashboardService = require('../services/dashboard.service');

const getStats = catchAsync(async (req, res) => {
  let stats;
  switch (req.user.role) {
    case 'admin':
      stats = await dashboardService.getAdminStats();
      break;
    case 'doctor':
      stats = await dashboardService.getDoctorStats(req.user.id);
      break;
    case 'patient':
      stats = await dashboardService.getPatientStats(req.user.id);
      break;
    default:
      stats = await dashboardService.getAdminStats();
  }
  res.json({ status: 'success', data: stats });
});

module.exports = { getStats };
