// controllers/materialController.js
const Material = require('../models/Material');

exports.addEntry = async (req, res) => {
    try {
        const { _id, sand, rocks, cement, isInactive, ...rest } = req.body;

        // Only include values that are neither 0, null, nor undefined
        const data = {
            ...rest,
            ...(sand !== 0 && sand != null ? { sand } : {}),
            ...(rocks !== 0 && rocks != null ? { rocks } : {}),
            ...(cement !== 0 && cement != null ? { cement } : {}),
            ...(isInactive !== true ? { isInactive } : {})  // Only include isInactive if true
        };
        const newEntry = new Material(data);
        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch (error) {
        res.status(500).json({ message: 'Failed to save entry', error });
    }
};

exports.getEntries = async (req, res) => {
    try {
        const { startDate, endDate, includeInactive, specificDate } = req.query;
        let query = {};

        // Filter by date range if provided
        if (specificDate) {
            query.date = specificDate;
        } else {
            // Filter by date range if provided
            if (startDate || endDate) {
                query.date = {};
                if (startDate) query.date.$gte = startDate;
                if (endDate) query.date.$lte = endDate;
            }
        }

        // Only fetch active records unless `includeInactive` is true
        if (includeInactive !== 'true') {
            query.isInactive = { $ne: true };
        }

        const entries = await Material.find(query).sort({ date: -1, time: -1 });

        // Convert null or undefined values to 0
        const modifiedEntries = entries.map(entry => ({
            ...entry.toObject(),
            sand: entry.sand != null ? entry.sand : 0,
            rocks: entry.rocks != null ? entry.rocks : 0,
            cement: entry.cement != null ? entry.cement : 0,
        }));

        res.status(200).json(modifiedEntries);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch entries', error });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { sand, rocks, cement, isInactive, ...rest } = req.body;

        // Only include values that are neither 0, null, nor undefined
        const data = {
            ...rest,
            ...(sand !== 0 && sand != null ? { sand } : {}),
            ...(rocks !== 0 && rocks != null ? { rocks } : {}),
            ...(cement !== 0 && cement != null ? { cement } : {}),
            ...(isInactive === true ? { isInactive } : {})  // Only include isInactive if true
        };

        const updatedEntry = await Material.findByIdAndUpdate(id, data, { new: true });

        if (!updatedEntry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        res.status(200).json(updatedEntry);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update entry', error });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEntry = await Material.findByIdAndDelete(id);

        if (!deletedEntry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete entry', error });
    }
};

exports.markAsInactive = async (req, res) => {
  const { id } = req.params;
  const reason = req.headers['x-deletion-reason'] || '';

  try {
    const updateFields = { isInactive: true };
    if (reason) {
      updateFields.reason = reason;
    }

    const result = await Material.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }  // Return the updated document
    );

    if (!result) {
      return res.status(404).send('Record not found');
    }

    res.send({ message: 'Record marked as inactive', reason });
  } catch (error) {
    res.status(500).send('Server error');
  }
};
