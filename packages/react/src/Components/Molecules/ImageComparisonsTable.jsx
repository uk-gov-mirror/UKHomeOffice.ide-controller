// Global imports
import PropTypes from 'prop-types';
import React from 'react';

// Local imports
import TableRow from './TableRow';
import { withContext } from '../Context';

const calculatePercentage = (score) => (score / 8000) * 100;

const resultText = (score) => {
  const percent = calculatePercentage(score);
  if (percent < 45 && percent > 0) {
    return 'FAIL';
  }
  if (percent === 0) {
    return 'No Data';
  }
  if (percent >= 45) {
    return 'PASS';
  }
  return 'No Data';
};

const resultClassName = (score) => {
  const percent = calculatePercentage(score);
  if (percent < 45 && percent > 0) {
    return 'fail';
  }
  if (percent === 0) {
    return 'warning';
  }
  if (percent >= 45) {
    return 'passed';
  }
  return 'neutral';
};

const ImageComparisonsTable = ({ value }) => {
  const { liveBioScore, bioChipScore, liveChipScore } =
    value.context?.match || {};

  return (
    <table className="govuk-table">
      <caption className="govuk-table__caption">Image comparisons</caption>
      <tbody className="govuk-table__body">
        <TableRow
          rowLabel="Live to chip"
          tagStatus={resultClassName(liveChipScore)}
          tagText={resultText(liveChipScore)}
        />
        <TableRow
          rowLabel="Live to document"
          tagStatus={resultClassName(liveBioScore)}
          tagText={resultText(liveBioScore)}
        />
        <TableRow
          rowLabel="Chip to document"
          tagStatus={resultClassName(bioChipScore)}
          tagText={resultText(bioChipScore)}
        />
      </tbody>
    </table>
  );
};

ImageComparisonsTable.propTypes = {
  value: PropTypes.shape({
    context: PropTypes.shape({
      match: PropTypes.shape({}),
    }),
    setContext: PropTypes.func,
  }),
};

ImageComparisonsTable.defaultProps = {
  value: {},
};

export default withContext(ImageComparisonsTable);
