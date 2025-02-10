<script lang="ts">
  import type { CalendarEvent } from '../../types';
  import Modal from './Modal.svelte';

  import { EventButtonType } from './../../stores/Calendar';
  import { getTextColor, ColorCode } from '../../utils/getTextContrast';

  export let event: CalendarEvent;

  let text = '';
  let className =
    'btn btn-block btn-xs border-0 rounded text-clip text-ellipsis whitespace-nowrap';

  $: modalId = `modal-${event.id}`;

  // bind control
  export let width: number | undefined;

  const createBackgroundColor = () =>
    $EventButtonType === 'Subject' || $EventButtonType === 'Teacher'
      ? `#${event.subject.color}`
      : event.teacher.color;

  const getComplementaryColor = (hex: string): string =>{
    // HEX to RGB
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    
    // Calculate complementary color
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;
    
    // Convert RGB back to HEX
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  let backgroundColor = createBackgroundColor();
  let borderColor = getComplementaryColor(backgroundColor);

  let textColor = getTextColor(backgroundColor as ColorCode);
  let style = '';

  $: {
    const {
      teacher,
      timeStart,
      timeEnd,
      classroom,
      subject,
      lessonType,
      rescheduled,
    } = event;

    const lessonTypeStr = lessonType.name.substring(0, 1);

    backgroundColor = createBackgroundColor();
    textColor = getTextColor(backgroundColor as ColorCode);

    if ($EventButtonType === 'Default') {
      if (!width || width < 130) {
        text = `${teacher.familyName}`;
      } else if (width < 300) {
        text = `${teacher.familyName} - ${classroom.name} ${lessonTypeStr}`;
      } else {
        text =
          `${timeStart} - ${timeEnd} : ${teacher.name} - ` +
          `${classroom.name} (${subject.name}) ${lessonTypeStr}`;
      }
    } else if (
      $EventButtonType === 'Subject' ||
      $EventButtonType === 'Teacher'
    ) {
      if (!width || width < 130) {
        text = `${timeStart} ${subject.name.substring(0, 1)}`;
      } else if (width < 240) {
        text = `${timeStart} ${subject.name} (${teacher.familyName}) ${lessonTypeStr}`;
      } else {
        text = `${timeStart} - ${timeEnd} : ${subject.name} (${teacher.familyName}) ${lessonTypeStr}`;
      }
    }

    style = 'color:' + textColor + ';background-color:' + backgroundColor + ';';

    if (rescheduled && width >= 240) {
      text += '(振替)';
    }

    if (rescheduled) {
      
      style += 'border:ridge thick ' + borderColor;
    }
  }
</script>

<label class={className} for={modalId} {style}>
  {text}
</label>
<Modal {modalId} {event} />
