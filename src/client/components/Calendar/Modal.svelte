<script lang="ts">
  import {
    OverlayText,
    OverlayType,
    OverlayState,
  } from './../../stores/Overlay';
  import {
    CalendarEvents,
    EventButtonType,
    RawSheetValues,
  } from './../../stores/Calendar';
  import MdiDeleteOutline from './../Svg/MdiDeleteOutline.svelte';
  import { APIClient } from '../../api';
  import type { CalendarEvent } from '../../types';
  import { createCalendarEvents } from '../../utils/createCalendarEvents';
  import 'dayjs/locale/ja';

  export let modalId: string;
  export let event: CalendarEvent;

  let isShowingDeleteConfirmBlock: boolean = false;
  let isShowingRescheduleConfirmBlock: boolean = false;
  let isDealingEvent: boolean = false;

  $: ({
    id,
    timeStart,
    timeEnd,
    teacher,
    classroom,
    subject,
    date,
    lessonType,
    rescheduled,
  } = event);
</script>

<input type="checkbox" id={modalId} class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle cursor-pointer">
  {#if !isShowingDeleteConfirmBlock && !isShowingRescheduleConfirmBlock}
    <div class="modal-box relative">
      <!-- Title -->
      <div class="font-bold text-2xl py-4">
        {date.locale('ja').format('YYYY年 MM月 DD日 (dd)')}
      </div>

      <!-- Contents -->
      <p class="font-bold text-lg py-2">{`${timeStart} - ${timeEnd}`}</p>
      <p>{`講師： ${teacher.name}`}</p>
      <p>{`生徒： ${classroom.name}`}</p>
      <p>{`教科： ${subject.name} （${lessonType.name}）`}</p>

      <div class="modal-action">
        {#if $EventButtonType !== 'Subject'}
          <button
            type="button"
            class="btn btn-error"
            on:click={() => {
              isShowingDeleteConfirmBlock = true;
            }}
          >
            <MdiDeleteOutline />
          </button>
          <button
            type="button"
            class="btn btn-warning"
            on:click={() => {
              isShowingRescheduleConfirmBlock = true;
            }}
          >
            {#if !rescheduled}
              振替
            {:else}
              振替取消
            {/if}
          </button>
        {/if}
        <label for={modalId} class="btn"> Close </label>
      </div>
    </div>
    {:else if isShowingDeleteConfirmBlock}
    <div class="modal-box relative">
      <h4 class="font-bold text-lg py-4">本当に消去しますか？</h4>
      <div class="modal-action">
        <button
          type="button"
          class={`btn ${isDealingEvent ? 'btn-disabled' : ''}`}
          on:click={() => {
            isShowingDeleteConfirmBlock = false;
          }}
        >
          No
        </button>
        <label
          for={modalId}
          class={`btn ${isDealingEvent ? 'btn-disabled loading' : 'btn-error'}`}
          on:click={() => {
            isDealingEvent = true;

            OverlayState.set(true);
            OverlayType.set('Loading');
            (async () => {
              const promise = await APIClient.DeleteEventById(id);
              if (promise.ok) {
                RawSheetValues.update((v) => {
                  v.main = v.main.filter((v) => v[0] !== id);
                  return v;
                });
                console.log($RawSheetValues);
                CalendarEvents.set(createCalendarEvents($RawSheetValues));
                console.log($CalendarEvents);

                OverlayText.set('削除しました。');
                OverlayType.set('Success');
              } else {
                alert(promise.error);
                OverlayText.set(
                  String(promise.error) + ' - ページをリロードしてください。',
                );
                OverlayType.set('Error');
              }

              isShowingDeleteConfirmBlock = false;
              isDealingEvent = false;
            })();
          }}
        >
          Yes
        </label>
      </div>
    </div>
  {:else if isShowingRescheduleConfirmBlock}
    <div class="modal-box relative">
      <h4 class="font-bold text-lg py-4">
        {#if !rescheduled}
          このコマを振替にしますか？
        {:else}
          振替を取り消しますか？
        {/if}
      </h4>
      <div class="modal-action">
        <button
          type="button"
          class={`btn ${isDealingEvent ? 'btn-disabled' : ''}`}
          on:click={() => {
            isShowingRescheduleConfirmBlock = false;
          }}
        >
          No
        </button>
        <label
          for={modalId}
          class={`btn ${isDealingEvent ? 'btn-disabled loading' : 'btn-error'}`}
          on:click={() => {
            isDealingEvent = true;

            OverlayState.set(true);
            OverlayType.set('Loading');
            (async () => {
              const promise = await APIClient.ToggleRescheduleEventById(id);
              if (promise.ok) {
                RawSheetValues.update((v) => {
                  v.main.forEach((d) => {
                    if(d[0] === id){
                      d[8] = !rescheduled;
                    }
                    return d;
                  });
                  return v;
                });
                console.log($RawSheetValues);
                CalendarEvents.set(createCalendarEvents($RawSheetValues));
                console.log($CalendarEvents);

                OverlayText.set('処理が完了しました。');
                OverlayType.set('Success');
              } else {
                alert(promise.error);
                OverlayText.set(
                  String(promise.error) + ' - ページをリロードしてください。',
                );
                OverlayType.set('Error');
              }

              isShowingRescheduleConfirmBlock = false;
              isDealingEvent = false;
            })();
          }}
        >
          Yes
        </label>
      </div>
    </div>
  {/if}
</div>
