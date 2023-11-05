import React from 'react';
import AreaInput from '~/components/input/AreaInput';

function DescriptionTab({ register }) {
  return (
    <div>
      <AreaInput name="dien_giai" placeholder="Ghi chú" register={register} />
    </div>
  );
}

export default DescriptionTab;
