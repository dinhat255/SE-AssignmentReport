const policies = [];

function initializePolicies() {
  policies.push(
    {
      id: 'policy-visitor-hourly',
      type: 'VISITOR_HOURLY_RATE',
      name: 'Visitor Hourly Rate',
      value: 5000,
      unit: 'VND/hour',
      currency: 'VND',
      effectiveFrom: '2026-01-01',
      effectiveTo: null,
      description: 'Standard hourly rate for visitor parking',
      active: true,
    },
    {
      id: 'policy-student-sub-monthly',
      type: 'STUDENT_SUBSCRIPTION_MONTHLY',
      name: 'Student Monthly Subscription',
      value: 50000,
      unit: 'VND/month',
      currency: 'VND',
      effectiveFrom: '2026-01-01',
      effectiveTo: null,
      description: 'Monthly subscription for students',
      active: true,
    },
    {
      id: 'policy-lecturer-quota-base',
      type: 'LECTURER_QUOTA_MONTHLY',
      name: 'Lecturer Monthly Quota',
      value: 50,
      unit: 'entries/month',
      currency: null,
      effectiveFrom: '2026-01-01',
      effectiveTo: null,
      description: 'Default monthly quota for lecturers',
      active: true,
    },
    {
      id: 'policy-lecturer-quota-purchase',
      type: 'LECTURER_QUOTA_PURCHASE',
      name: 'Lecturer Quota Purchase Rate',
      value: 1000,
      unit: 'VND per entry',
      currency: 'VND',
      effectiveFrom: '2026-01-01',
      effectiveTo: null,
      description: 'Price to purchase additional parking entries for lecturers',
      active: true,
    },
  );
}

initializePolicies();

module.exports = policies;
