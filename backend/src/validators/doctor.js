const { z } = require('zod');

const updatePhaseSchema = z.object({
  phase: z.enum(['PHASE_1', 'PHASE_2', 'PHASE_3'], {
    errorMap: () => ({ message: 'Phase must be one of: PHASE_1, PHASE_2, PHASE_3' })
  })
});

module.exports = { updatePhaseSchema };
